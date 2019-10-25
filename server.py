from http.server import BaseHTTPRequestHandler, HTTPServer

PORT_NUMBER = 8014

#This class will handles any incoming request from
#the browser 
class myHandler(BaseHTTPRequestHandler):

    def open_file(self, dir):
        file = open(dir, "rb")
        result = file.read()
        file.close()
        return result

    def _set_response(self, content_type):
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.end_headers()
    
    #Handler for the GET requests
    def do_GET(self):
        # Send the html message
        if self.path == "/" or self.path == "/main.html":
            self._set_response("text/html")
            self.wfile.write(self.open_file("main.html"))
            return
        if self.path == "/main.css":
            self._set_response("text/css")
            self.wfile.write(self.open_file("main.css"))
            return
        if self.path == "/2705.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("2705.png"))
            return
        if self.path == "/design.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("design.png"))
            return
        if self.path == "/EuclideaLogo.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("EuclideaLogo.png"))
            return
        if self.path == "/favicon2.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("favicon2.png"))
            return
        if self.path == "/fb.svg":
            self._set_response("image/svg+xml")
            self.wfile.write(self.open_file("fb.svg"))
            return
        if self.path == "/game_preview.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("game_preview.png"))
            return
        if self.path == "/inst.svg":
            self._set_response("image/svg+xml")
            self.wfile.write(self.open_file("inst.svg"))
            return
        if self.path == "/logo.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("logo.png"))
            return
        if self.path == "/logo2.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("logo2.png"))
            return
        if self.path == "/pattern.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("pattern.png"))
            return
        if self.path == "/tw.svg":
            self._set_response("image/svg+xml")
            self.wfile.write(self.open_file("tw.svg"))
            return
        if self.path == "/vk.svg":
            self._set_response("image/svg+xml")
            self.wfile.write(self.open_file("vk.svg"))
            return

try:
    #Create a web server and define the handler to manage the
    #incoming request
    server = HTTPServer(('', PORT_NUMBER), myHandler)
    print('Started httpserver on port ' , PORT_NUMBER)
    
    #Wait forever for incoming htto requests
    server.serve_forever()

except KeyboardInterrupt:
    print('^C received, shutting down the web server')
    server.socket.close()