package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/nathan-osman/go-daylight/server"
	"github.com/urfave/cli"
)

func main() {
	app := cli.NewApp()
	app.Name = "daylight"
	app.Usage = "Sunrise and sunset web application"
	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:   "server-addr",
			Value:  ":8000",
			EnvVar: "SERVER_ADDR",
			Usage:  "server address",
		},
	}
	app.Action = func(c *cli.Context) error {

		// Create and start the server
		s, err := server.New(&server.Config{
			Addr: c.String("server-addr"),
		})
		if err != nil {
			return err
		}
		defer s.Close()

		// Wait for SIGINT or SIGTERM
		sigChan := make(chan os.Signal)
		signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
		<-sigChan

		return nil
	}
	if err := app.Run(os.Args); err != nil {
		fmt.Fprintf(os.Stderr, "Fatal: %s\n", err.Error())
	}
}
