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
        if self.path == "/css/main.css":
            self._set_response("text/css")
            self.wfile.write(self.open_file("css/main.css"))
            return
        if self.path == "/css/GameStyles.css":
            self._set_response("text/css")
            self.wfile.write(self.open_file("css/GameStyles.css"))
            return
        if self.path == "/js/Game.js":
            self._set_response("application/javascript")
            self.wfile.write(self.open_file("js/Game.js"))
            return
        if self.path == "/js/Namespace.js":
            self._set_response("application/javascript")
            self.wfile.write(self.open_file("js/Namespace.js"))
            return
        if self.path == "/images/2705.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("images/2705.png"))
            return
        if self.path == "/images/design.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("images/design.png"))
            return
        if self.path == "/images/EuclideaLogo.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("images/EuclideaLogo.png"))
            return
        if self.path == "/images/favicon2.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("images/favicon2.png"))
            return
        if self.path == "/images/fb.svg":
            self._set_response("image/svg+xml")
            self.wfile.write(self.open_file("images/fb.svg"))
            return
        if self.path == "/images/game_preview.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("images/game_preview.png"))
            return
        if self.path == "/images/inst.svg":
            self._set_response("image/svg+xml")
            self.wfile.write(self.open_file("images/inst.svg"))
            return
        if self.path == "/images/logo.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("images/logo.png"))
            return
        if self.path == "/images/logo2.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("images/logo2.png"))
            return
        if self.path == "/images/pattern.png":
            self._set_response("image/png")
            self.wfile.write(self.open_file("images/pattern.png"))
            return
        if self.path == "/images/tw.svg":
            self._set_response("image/svg+xml")
            self.wfile.write(self.open_file("images/tw.svg"))
            return
        if self.path == "/images/vk.svg":
            self._set_response("image/svg+xml")
            self.wfile.write(self.open_file("images/vk.svg"))
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