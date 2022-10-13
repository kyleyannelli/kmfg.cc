package main

import (
	"errors"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/models"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func defaultPublicDir() string {
	if strings.HasPrefix(os.Args[0], os.TempDir()) {
		// most likely ran with go run
		return "./pb_public"
	}

	return filepath.Join(os.Args[0], "../pb_public")
}

//	Middlewares: []echo.MiddlewareFunc{
//					apis.RequireAdminOrUserAuth(),
//				},
func main() {
	app := pocketbase.New()

	var publicDirFlag string

	// add "--publicDir" option flag
	app.RootCmd.PersistentFlags().StringVar(
		&publicDirFlag,
		"publicDir",
		defaultPublicDir(),
		"the directory to serve static files",
	)

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		servePublicDir(e, publicDirFlag)
		userExists(app, e)

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}

func servePublicDir(e *core.ServeEvent, publicDirFlag string) {
	// serves static files from the provided public dir (if exists)
	//dirHandler := apis.StaticDirectoryHandler(os.DirFS(publicDirFlag), false)
	// add new "GET /api/hello" route to the app router (echo)
	e.Router.AddRoute(echo.Route{
		Method: http.MethodGet,
		Path:   "/*",
		//Handler: dirHandler,
		Handler: func(c echo.Context) error {
			dirfs := os.DirFS(publicDirFlag)
			p := c.PathParam("*")
			//fs.FS.Open() already assumes that file names are relative to FS root path and considers name with prefix `/` as invalid
			name := filepath.ToSlash(filepath.Clean(strings.TrimPrefix(p, "")))
			return handleReactDir(c, name, dirfs)
		},
	})
}

func userExists(app *pocketbase.PocketBase, e *core.ServeEvent) {
	// add new "GET /api/hello" route to the app router (echo)
	e.Router.AddRoute(echo.Route{
		Method: http.MethodPost,
		Path:   "/api/exists",
		Handler: func(c echo.Context) error {
			email := c.FormValue("email")
			user := models.User{}
			app.Dao().DB().
				NewQuery("SELECT * FROM _users WHERE email={:email}").
				Bind(dbx.Params{"email": email}).
				One(&user)
			if user.HasId() {
				return c.String(200, "true")
			}
			return c.String(200, "false")
		},
	})
}

func handleReactDir(c echo.Context, file string, filesystem fs.FS) error {
	print(file + " ")
	exists := doesFileExist(file, filesystem)
	if exists != nil || file == "." {
		print("file not found!\n")
		// try loading root dir
		return myFsFile(c, "index.html", filesystem)
	}
	return dirLoader(c, filesystem)
}

func dirLoader(c echo.Context, fileSystem fs.FS) error {
	p := c.PathParam("*")

	// fs.FS.Open() already assumes that file names are relative to FS root path and considers name with prefix `/` as invalid
	name := filepath.ToSlash(filepath.Clean(strings.TrimPrefix(p, "/")))
	fi, err := fs.Stat(fileSystem, name)
	if err != nil {
		return echo.ErrNotFound
	}

	// If the request is for a directory and does not end with "/"
	p = c.Request().URL.Path // path must not be empty.
	if fi.IsDir() && len(p) > 0 && p[len(p)-1] != '/' {
		// Redirect to ends with "/"
		return c.Redirect(http.StatusMovedPermanently, p+"/")
	}
	return myFsFile(c, name, fileSystem)
}

func myFsFile(c echo.Context, file string, fileSystem fs.FS) error {
	f, err := fileSystem.Open(file)
	if err != nil {
		return echo.ErrNotFound
	}
	defer f.Close()

	fi, _ := f.Stat()
	if fi.IsDir() {
		file = filepath.ToSlash(filepath.Join(file, defaultPublicDir())) // ToSlash is necessary for Windows. fs.Open and os.Open are different in that aspect.
		f, err = fileSystem.Open(file)
		if err != nil {
			return echo.ErrNotFound
		}
		defer f.Close()
		if fi, err = f.Stat(); err != nil {
			return err
		}
	}
	ff, ok := f.(io.ReadSeeker)
	if !ok {
		return errors.New("file does not implement io.ReadSeeker")
	}
	http.ServeContent(c.Response(), c.Request(), fi.Name(), fi.ModTime(), ff)
	return nil
}

func doesFileExist(file string, filesystem fs.FS) error {
	f, err := filesystem.Open(file)
	if err != nil {
		return echo.ErrNotFound
	}
	defer f.Close()

	fi, _ := f.Stat()
	if fi.IsDir() {
		f, err = filesystem.Open(file)
		if err != nil {
			return echo.ErrNotFound
		}
		defer f.Close()
		if fi, err = f.Stat(); err != nil {
			return err
		}
	}
	return nil
}
