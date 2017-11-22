FROM scratch
MAINTAINER Nathan Osman <nathan@quickmediasolutions.com>

# Add the executable
ADD dist/daylight /usr/local/bin/

# Set the entrypoint for the container
ENTRYPOINT ["/usr/local/bin/daylight"]
