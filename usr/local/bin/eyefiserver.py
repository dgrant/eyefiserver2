#!/usr/bin/env python

"""
* Copyright (c) 2009, Jeffrey Tchang
* Additional *pike
* All rights reserved.
*
*
* THIS SOFTWARE IS PROVIDED ''AS IS'' AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY
* DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
"""


import string
import cgi
import time
from datetime import timedelta

import sys
import os
import socket
import thread
import StringIO

import hashlib
import binascii
import select 
import tarfile

import xml.sax
from xml.sax.handler import ContentHandler 
import xml.dom.minidom

from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import BaseHTTPServer
import httplib

import SocketServer

import logging
import logging.handlers

import atexit
from signal import SIGTERM
import signal

#pike
from datetime import datetime
import ConfigParser

import simplejson
import math

class Daemon:
    """
    A generic daemon class.

    Usage: subclass the Daemon class and override the run() method
    """
    def __init__(self, pidfile, stdin='/dev/null', stdout='/dev/null', stderr='/dev/null'):
            self.stdin = stdin
            self.stdout = stdout
            self.stderr = stderr
            self.pidfile = pidfile

    def daemonize(self):
            """
            do the UNIX double-fork magic, see Stevens' "Advanced
            Programming in the UNIX Environment" for details (ISBN 0201563177)
            http://www.erlenstar.demon.co.uk/unix/faq_2.html#SEC16
            """
            try:
                    pid = os.fork()
                    if pid > 0:
                            # exit first parent
                            sys.exit(0)
            except OSError, e:
                    sys.stderr.write("fork #1 failed: %d (%s)\n" % (e.errno, e.strerror))
                    sys.exit(1)

            # decouple from parent environment
            os.chdir("/")
            os.setsid()
            os.umask(0)

            # do second fork
            try:
                    pid = os.fork()
                    if pid > 0:
                            # exit from second parent
                            sys.exit(0)
            except OSError, e:
                    sys.stderr.write("fork #2 failed: %d (%s)\n" % (e.errno, e.strerror))
                    sys.exit(1)

            # redirect standard file descriptors
            sys.stdout.flush()
            sys.stderr.flush()
            si = file(self.stdin, 'r')
            so = file(self.stdout, 'a+')
            se = file(self.stderr, 'a+', 0)
            os.dup2(si.fileno(), sys.stdin.fileno())
            os.dup2(so.fileno(), sys.stdout.fileno())
            os.dup2(se.fileno(), sys.stderr.fileno())

            # write pidfile
            atexit.register(self.delpid)
            pid = str(os.getpid())
            file(self.pidfile,'w+').write("%s\n" % pid)

    def delpid(self):
            os.remove(self.pidfile)

    def start(self):
            """
            Start the daemon
            """
            # Check for a pidfile to see if the daemon already runs
            try:
                    pf = file(self.pidfile,'r')
                    pid = int(pf.read().strip())
                    pf.close()
            except IOError:
                    pid = None

            if pid:
                    message = "pidfile %s already exist. Daemon already running?\n"
                    sys.stderr.write(message % self.pidfile)
                    sys.exit(1)

            # Start the daemon
            self.daemonize()
            self.run()

    def stop(self):
            """
            Stop the daemon
            """
            # Get the pid from the pidfile
            try:
                    pf = file(self.pidfile,'r')
                    pid = int(pf.read().strip())
                    pf.close()
            except IOError:
                    pid = None

            if not pid:
                    message = "pidfile %s does not exist. Daemon not running?\n"
                    sys.stderr.write(message % self.pidfile)
                    return # not an error in a restart

            # Try killing the daemon process
            try:
                    while 1:
                            os.kill(pid, SIGTERM)
                            time.sleep(0.1)
            except OSError, err:
                    err = str(err)
                    if err.find("No such process") > 0:
                            if os.path.exists(self.pidfile):
                                    os.remove(self.pidfile)
                    else:
                            print str(err)
                            sys.exit(1)

    def restart(self):
            """
            Restart the daemon
            """
            self.stop()
            self.start()

    def reload(self):
            """
            Reload configuration
            """
            # Get the pid from the pidfile
            try:
                    pf = file(self.pidfile,'r')
                    pid = int(pf.read().strip())
                    pf.close()
            except IOError:
                    pid = None

            if not pid:
                    message = "pidfile %s does not exist. Daemon not running?\n"
                    sys.stderr.write(message % self.pidfile)
                    return 1

            # Try killing the daemon process
            try:
                    os.kill(pid, signal.SIGUSR1)
            except OSError, err:
                    print str(err)

    def run(self):
            """
            You should override this method when you subclass Daemon. It will be called after the process has been
            daemonized by start() or restart().
            """


"""
General architecture notes


This is a standalone Eye-Fi Server that is designed to take the place of the Eye-Fi Manager.


Starting this server creates a listener on port 59278. I use the BaseHTTPServer class included
with Python. I look for specific POST/GET request URLs and execute functions based on those
URLs.




"""




# Create the main logger
eyeFiLogger = logging.Logger("eyeFiLogger",logging.DEBUG)

# Create two handlers. One to print to the log and one to print to the console
consoleHandler = logging.StreamHandler(sys.stdout)

# Set how both handlers will print the pretty log events
eyeFiLoggingFormat = logging.Formatter("[%(asctime)s][%(funcName)s] - %(message)s",'%m/%d/%y %I:%M%p')
consoleHandler.setFormatter(eyeFiLoggingFormat)

# Append both handlers to the main Eye Fi Server logger
eyeFiLogger.addHandler(consoleHandler)




# Eye Fi XML SAX ContentHandler
class EyeFiContentHandler(ContentHandler):

  # These are the element names that I want to parse out of the XML
  elementNamesToExtract = ["macaddress","cnonce","transfermode","transfermodetimestamp","fileid","filename","filesize","filesignature"]  

  # For each of the element names I create a dictionary with the value to False
  elementsToExtract = {}

  # Where to put the extracted values
  extractedElements = {}


  def __init__(self):
    self.extractedElements = {}

    for elementName in self.elementNamesToExtract:
        self.elementsToExtract[elementName] = False

  def startElement(self, name, attributes):

    # If the name of the element is a key in the dictionary elementsToExtract
    # set the value to True
    if name in self.elementsToExtract:
      self.elementsToExtract[name] = True

  def endElement(self, name):

    # If the name of the element is a key in the dictionary elementsToExtract
    # set the value to False
    if name in self.elementsToExtract:
      self.elementsToExtract[name] = False


  def characters(self, content):

    for elementName in self.elementsToExtract:
      if self.elementsToExtract[elementName] == True:
        self.extractedElements[elementName] = content

# Implements an EyeFi server
class EyeFiServer(SocketServer.ThreadingMixIn, BaseHTTPServer.HTTPServer):

  def reload_config(self, signum, frame):
    try:
        configfile = sys.argv[2]
        eyeFiLogger.info("Reloading configuration " + configfile)
        self.config.read(configfile)
    except:
        eyeFiLogger.error("Error reloading configuration")

  def server_bind(self):

    BaseHTTPServer.HTTPServer.server_bind(self)
    self.socket.settimeout(None)
    signal.signal(signal.SIGUSR1, self.reload_config)
    self.run = True

  def get_request(self):
    while self.run:
      try:
        connection, address = self.socket.accept()
        eyeFiLogger.debug("Incoming connection from client %s" % address[0])

        connection.settimeout(None)
        return (connection, address)

      except socket.timeout:
        self.socket.close()
        pass

  def stop(self):
    self.run = False

  # alt serve_forever method for python <2.6
  # because we want a shutdown mech ..
  #def serve(self):
  #  while self.run:
  #    self.handle_request()
  #  self.socket.close()



# This class is responsible for handling HTTP requests passed to it.
# It implements the two most common HTTP methods, do_GET() and do_POST()

class EyeFiRequestHandler(BaseHTTPRequestHandler):

  # pike: these seem unused ?
  protocol_version = 'HTTP/1.1'
  sys_version = ""
  server_version = "Eye-Fi Agent/2.0.4.0 (Windows XP SP2)"

  def do_QUIT (self):
    eyeFiLogger.debug("Got StopServer request .. stopping server")
    self.send_response(200)
    self.end_headers()
    self.server.stop()

  def do_GET(self):

    eyeFiLogger.debug(self.command + " " + self.path + " " + self.request_version)

    SOAPAction = ""
    eyeFiLogger.debug("Headers received in GET request:")
    for headerName in self.headers.keys():
      for headerValue in self.headers.getheaders(headerName):
        eyeFiLogger.debug(headerName + ": " + headerValue)
        if( headerName == "soapaction"):
          SOAPAction = headerValue

    # couldnt get this to work ..
    #if((self.client_address == "localhost") and (self.path == "/api/soap/eyefilm/v1x") and (SOAPAction == "\"urn:StopServer\"")):
    #  eyeFiLogger.debug("Got StopServer request .. stopping server")
    #  self.server.stop()
    # or, for python 2.6>
    #  self.server.shutdown()

    self.send_response(200)
    self.send_header('Content-type','text/html')
    # I should be sending a Content-Length header with HTTP/1.1 but I am being lazy
    # self.send_header('Content-length', '123')
    self.end_headers()
    self.wfile.write(self.client_address)
    self.wfile.write(self.headers)
    self.close_connection = 0


  def do_POST(self):
    eyeFiLogger.debug(self.command + " " + self.path + " " + self.request_version)

    SOAPAction = ""
    contentLength = ""

    # Loop through all the request headers and pick out ones that are relevant

    eyeFiLogger.debug("Headers received in POST request:")
    for headerName in self.headers.keys():
      for headerValue in self.headers.getheaders(headerName):

        if( headerName == "soapaction"):
          SOAPAction = headerValue

        if( headerName == "content-length"):
          contentLength = int(headerValue)

        eyeFiLogger.debug(headerName + ": " + headerValue)


    # Read contentLength bytes worth of data
    eyeFiLogger.debug("Attempting to read " + str(contentLength) + " bytes of data")
    # postData = self.rfile.read(contentLength)
    try:
        from StringIO import StringIO
        import tempfile
    except ImportError:
        eyeFiLogger.debug("No StringIO module")
    chunksize = 1048576 # 1MB
    mem = StringIO()
    while 1:
        remain = contentLength - mem.tell()
        if remain <= 0: break
        chunk = self.rfile.read(min(chunksize, remain))
        if not chunk: break
        mem.write(chunk)
        print remain
    print "Finished"
    postData = mem.getvalue()
    mem.close()
    
    eyeFiLogger.debug("Finished reading " + str(contentLength) + " bytes of data")

    # TODO: Implement some kind of visual progress bar
    # bytesRead = 0
    # postData = ""
    
    # while(bytesRead < contentLength):
    #  postData = postData + self.rfile.read(1)
    #   bytesRead = bytesRead + 1
      
    #  if(bytesRead % 10000 == 0):
    #    print "#",    


    # Perform action based on path and SOAPAction
    # A SOAPAction of StartSession indicates the beginning of an EyeFi
    # authentication request
    if((self.path == "/api/soap/eyefilm/v1") and (SOAPAction == "\"urn:StartSession\"")):
      eyeFiLogger.debug("Got StartSession request")
      response = self.startSession(postData)
      contentLength = len(response)

      eyeFiLogger.debug("StartSession response: " + response)

      self.send_response(200)
      self.send_header('Date', self.date_time_string())
      self.send_header('Pragma','no-cache')
      self.send_header('Server','Eye-Fi Agent/2.0.4.0 (Windows XP SP2)')
      self.send_header('Content-Type','text/xml; charset="utf-8"')
      self.send_header('Content-Length', contentLength)
      self.end_headers()

      self.wfile.write(response)
      self.wfile.flush()
      self.handle_one_request()

    # GetPhotoStatus allows the card to query if a photo has been uploaded
    # to the server yet
    if((self.path == "/api/soap/eyefilm/v1") and (SOAPAction == "\"urn:GetPhotoStatus\"")):
      eyeFiLogger.debug("Got GetPhotoStatus request")

      response = self.getPhotoStatus(postData)
      contentLength = len(response)

      eyeFiLogger.debug("GetPhotoStatus response: " + response)

      self.send_response(200)
      self.send_header('Date', self.date_time_string())
      self.send_header('Pragma','no-cache')
      self.send_header('Server','Eye-Fi Agent/2.0.4.0 (Windows XP SP2)')
      self.send_header('Content-Type','text/xml; charset="utf-8"')
      self.send_header('Content-Length', contentLength)
      self.end_headers()

      self.wfile.write(response)
      self.wfile.flush()


    # If the URL is upload and there is no SOAPAction the card is ready to send a picture to me  
    if((self.path == "/api/soap/eyefilm/v1/upload") and (SOAPAction == "")):
      eyeFiLogger.debug("Got upload request")      
      response = self.uploadPhoto(postData)
      contentLength = len(response)

      eyeFiLogger.debug("Upload response: " + response)

      self.send_response(200)
      self.send_header('Date', self.date_time_string())
      self.send_header('Pragma','no-cache')
      self.send_header('Server','Eye-Fi Agent/2.0.4.0 (Windows XP SP2)')
      self.send_header('Content-Type','text/xml; charset="utf-8"')
      self.send_header('Content-Length', contentLength)
      self.end_headers()

      self.wfile.write(response)
      self.wfile.flush()

    # If the URL is upload and SOAPAction is MarkLastPhotoInRoll
    if((self.path == "/api/soap/eyefilm/v1") and (SOAPAction == "\"urn:MarkLastPhotoInRoll\"")):
      eyeFiLogger.debug("Got MarkLastPhotoInRoll request")
      response = self.markLastPhotoInRoll(postData)
      contentLength = len(response)

      eyeFiLogger.debug("MarkLastPhotoInRoll response: " + response)
      self.send_response(200)
      self.send_header('Date', self.date_time_string())
      self.send_header('Pragma','no-cache')
      self.send_header('Server','Eye-Fi Agent/2.0.4.0 (Windows XP SP2)')
      self.send_header('Content-Type','text/xml; charset="utf-8"') 
      self.send_header('Content-Length', contentLength)
      self.send_header('Connection', 'Close')
      self.end_headers()

      self.wfile.write(response)
      self.wfile.flush()

      eyeFiLogger.debug("Connection closed.")


  # Handles MarkLastPhotoInRoll action
  def markLastPhotoInRoll(self,postData):
    # Create the XML document to send back
    doc = xml.dom.minidom.Document()

    SOAPElement = doc.createElementNS("http://schemas.xmlsoap.org/soap/envelope/","SOAP-ENV:Envelope")
    SOAPElement.setAttribute("xmlns:SOAP-ENV","http://schemas.xmlsoap.org/soap/envelope/")
    SOAPBodyElement = doc.createElement("SOAP-ENV:Body")

    markLastPhotoInRollResponseElement = doc.createElement("MarkLastPhotoInRollResponse")

    SOAPBodyElement.appendChild(markLastPhotoInRollResponseElement)
    SOAPElement.appendChild(SOAPBodyElement)
    doc.appendChild(SOAPElement)

    return doc.toxml(encoding="UTF-8")


  # Handles receiving the actual photograph from the card.
  # postData will most likely contain multipart binary post data that needs to be parsed 
  def uploadPhoto(self,postData):

    # Take the postData string and work with it as if it were a file object
    postDataInMemoryFile = StringIO.StringIO(postData)

    # Get the content-type header which looks something like this
    # content-type: multipart/form-data; boundary=---------------------------02468ace13579bdfcafebabef00d
    contentTypeHeader = self.headers.getheaders('content-type').pop()
    eyeFiLogger.debug(contentTypeHeader)

    # Extract the boundary parameter in the content-type header
    headerParameters = contentTypeHeader.split(";")
    eyeFiLogger.debug(headerParameters)

    boundary = headerParameters[1].split("=")
    boundary = boundary[1].strip()
    eyeFiLogger.debug("Extracted boundary: " + boundary)

    # eyeFiLogger.debug("uploadPhoto postData: " + postData)

    # Parse the multipart/form-data
    form = cgi.parse_multipart(postDataInMemoryFile, {"boundary":boundary,"content-disposition":self.headers.getheaders('content-disposition')})
    eyeFiLogger.debug("Available multipart/form-data: " + str(form.keys()))

    # Parse the SOAPENVELOPE using the EyeFiContentHandler()
    soapEnvelope = form['SOAPENVELOPE'][0]
    eyeFiLogger.debug("SOAPENVELOPE: " + soapEnvelope)
    handler = EyeFiContentHandler()
    parser = xml.sax.parseString(soapEnvelope,handler)

    eyeFiLogger.debug("Extracted elements: " + str(handler.extractedElements))


    imageTarfileName = handler.extractedElements["filename"]

    #pike
    uid = self.server.config.getint('EyeFiServer','upload_uid')
    gid = self.server.config.getint('EyeFiServer','upload_gid')
    file_mode = self.server.config.get('EyeFiServer','upload_file_mode')
    dir_mode = self.server.config.get('EyeFiServer','upload_dir_mode')
    eyeFiLogger.debug("Using uid/gid %d/%d"%(uid,gid))
    eyeFiLogger.debug("Using file_mode " + file_mode)
    eyeFiLogger.debug("Using dir_mode " + dir_mode)

    geotag_enable = int(self.server.config.getint('EyeFiServer','geotag_enable'))
    geotag_accuracy = int(self.server.config.get('EyeFiServer','geotag_accuracy'))

    tempDir = os.path.dirname(self.server.config.get('EyeFiServer','upload_dir'))


    imageTarPath = os.path.join(tempDir, imageTarfileName)
    eyeFiLogger.debug("Generated path " + imageTarPath)


    fileHandle = open(imageTarPath, 'wb')
    eyeFiLogger.debug("Opened file " + imageTarPath + " for binary writing")

    fileHandle.write(form['FILENAME'][0])
    eyeFiLogger.debug("Wrote file " + imageTarPath)

    fileHandle.close()
    eyeFiLogger.debug("Closed file " + imageTarPath)

    eyeFiLogger.debug("Extracting TAR file " + imageTarPath)
    imageTarfile = tarfile.open(imageTarPath)

    for member in imageTarfile.getmembers():
        timezone = time.timezone if (time.daylight == 0) else time.altzone
        timezone = timezone / 60 / 60 * -1
        imageDate = datetime.fromtimestamp(member.mtime) - timedelta(hours=timezone)
        uploadDir = imageDate.strftime(self.server.config.get('EyeFiServer','upload_dir'))
        eyeFiLogger.debug("Creating folder " + uploadDir)
        if not os.path.isdir(uploadDir):
            os.makedirs(uploadDir)
            if uid != 0 and gid != 0:
                os.chown(uploadDir, uid, gid)
            if file_mode != "":
                os.chmod(uploadDir, string.atoi(dir_mode))

        f=imageTarfile.extract(member, uploadDir)
        imagePath = os.path.join(uploadDir, member.name)
        eyeFiLogger.debug("imagePath " + imagePath)
        if uid != 0 and gid != 0:
            os.chown(imagePath, uid, gid)
        if file_mode != "":
            os.chmod(imagePath, string.atoi(file_mode))

        if geotag_enable>0 and member.name.lower().endswith(".log"):
            eyeFiLogger.debug("Processing LOG file " + imagePath)
            try:
              imageName = member.name[:-4]
              shottime, aps = list(self.parselog(imagePath,imageName))
              aps = self.getphotoaps(shottime, aps)
              loc = self.getlocation(aps)
              if loc['status']=='OK' and float(loc['accuracy'])<=geotag_accuracy:
                  xmpName=imageName+".xmp"
                  xmpPath=os.path.join(uploadDir, xmpName)
                  eyeFiLogger.debug("Writing XMP file " + xmpPath)
                  self.writexmp(xmpPath,float(loc['location']['lat']),float(loc['location']['lng']))
                  if uid != 0 and gid != 0:
                      os.chown(xmpPath, uid, gid)
                  if file_mode != "":
                      os.chmod(xmpPath, string.atoi(file_mode))
            except:
              eyeFiLogger.error("Error processing LOG file " + imagePath)

    eyeFiLogger.debug("Closing TAR file " + imageTarPath)
    imageTarfile.close()

    eyeFiLogger.debug("Deleting TAR file " + imageTarPath)
    os.remove(imageTarPath)


    try:
        import pyexiv2

        metadata = pyexiv2.ImageMetadata(imagePath)
        metadata.read()
        if 'Exif.Image.DateTime' in metadata.exif_keys:
            d = metadata['Exif.Image.DateTime'].value
            seconds = time.mktime(d.timetuple())
            os.utime(imagePath, (seconds, seconds))
        else:
            eyeFiLogger.error("Could not find Exif.Image.DateTime field in EXIF information")
    except ImportError, e:
        eyeFiLogger.error("pyexiv2 module not present. Could not read EXIF information.")
        if e.message != 'No module named pyexiv2':
            raise

    # Create the XML document to send back
    doc = xml.dom.minidom.Document()

    SOAPElement = doc.createElementNS("http://schemas.xmlsoap.org/soap/envelope/","SOAP-ENV:Envelope")
    SOAPElement.setAttribute("xmlns:SOAP-ENV","http://schemas.xmlsoap.org/soap/envelope/")    
    SOAPBodyElement = doc.createElement("SOAP-ENV:Body")

    uploadPhotoResponseElement = doc.createElement("UploadPhotoResponse")
    successElement = doc.createElement("success")
    successElementText = doc.createTextNode("true")

    successElement.appendChild(successElementText)
    uploadPhotoResponseElement.appendChild(successElement)

    SOAPBodyElement.appendChild(uploadPhotoResponseElement)
    SOAPElement.appendChild(SOAPBodyElement)
    doc.appendChild(SOAPElement)

    return doc.toxml(encoding="UTF-8")

  def parselog(self,logfile,filename):
    shottime = 0
    aps = {}
    for line in open(logfile):
        time, timestamp, act = line.strip().split(",", 2)
        act = act.split(",")
        act, args = act[0], act[1:]
        if act in ("AP", "NEWAP"):
            aps.setdefault(args[0], []).append({"time": int(time),"pwr": int(args[1])})
        elif act == "NEWPHOTO":
            if filename==args[0]:
                shottime = int(time)
        elif act == "POWERON":
            if shottime>0:
                return shottime, aps
            shottime = 0
            aps = {}
        if shottime>0:
            return shottime, aps

  def getphotoaps(self, time, aps):
    geotag_lag = int(self.server.config.get('EyeFiServer','geotag_lag'))
    newaps = []
    for mac in aps:
        lag = min([(abs(ap["time"] - time), ap["pwr"]) for ap in aps[mac]], key=lambda a: a[0])
        if lag[0] <= geotag_lag:
            newaps.append({"mac": mac, "pwr": lag[1]})
    return newaps

  def getlocation(self, aps):
    try:
        geourl = 'maps.googleapis.com'
        headers = {"Host": geourl}
        params = "?browser=none&sensor=false"
        for ap in aps:
            params+='&wifi=mac:'+'-'.join([ap['mac'][2*d:2*d+2] for d in range(6)])+'|ss:'+str(int(math.log10(ap['pwr']/100.0)*10-50))
        conn = httplib.HTTPSConnection(geourl)
        conn.request("GET", "/maps/api/browserlocation/json"+params, "", headers)
        resp = conn.getresponse()
        result = resp.read()
        conn.close()
    except:
        None
    return simplejson.loads(result)

  def writexmp(self,name,latitude,longitude):
    if latitude>0:
        ref="N"
    else:
        ref="S"
    latitude=str(abs(latitude)).split('.')
    latitude[1]=str(float('0.'+latitude[1])*60)
    latitude=','.join(latitude)+ref

    if longitude>0:
        ref="E"
    else:
        ref="W"
    longitude=str(abs(longitude)).split('.')
    longitude[1]=str(float('0.'+longitude[1])*60)
    longitude=','.join(longitude)+ref

    FILE = open(name,"w")
    FILE.write("<?xpacket begin='\xef\xbb\xbf' id='W5M0MpCehiHzreSzNTczkc9d'?>\n<x:xmpmeta xmlns:x='adobe:ns:meta/' x:xmptk='EyeFiServer'>\n<rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'>\n<rdf:Description rdf:about='' xmlns:exif='http://ns.adobe.com/exif/1.0/'>\n<exif:GPSLatitude>"+latitude+"</exif:GPSLatitude>\n<exif:GPSLongitude>"+longitude+"</exif:GPSLongitude>\n<exif:GPSVersionID>2.2.0.0</exif:GPSVersionID>\n</rdf:Description>\n</rdf:RDF>\n</x:xmpmeta>\n<?xpacket end='w'?>\n")
    FILE.close()

  def getPhotoStatus(self,postData):
    handler = EyeFiContentHandler()
    parser = xml.sax.parseString(postData,handler)

    # Create the XML document to send back
    doc = xml.dom.minidom.Document()

    SOAPElement = doc.createElementNS("http://schemas.xmlsoap.org/soap/envelope/","SOAP-ENV:Envelope")
    SOAPElement.setAttribute("xmlns:SOAP-ENV","http://schemas.xmlsoap.org/soap/envelope/")    
    SOAPBodyElement = doc.createElement("SOAP-ENV:Body")

    getPhotoStatusResponseElement = doc.createElement("GetPhotoStatusResponse")
    getPhotoStatusResponseElement.setAttribute("xmlns","http://localhost/api/soap/eyefilm")

    fileidElement = doc.createElement("fileid")
    fileidElementText = doc.createTextNode("1")
    fileidElement.appendChild(fileidElementText)

    offsetElement = doc.createElement("offset")
    offsetElementText = doc.createTextNode("0")
    offsetElement.appendChild(offsetElementText)

    getPhotoStatusResponseElement.appendChild(fileidElement)
    getPhotoStatusResponseElement.appendChild(offsetElement)

    SOAPBodyElement.appendChild(getPhotoStatusResponseElement)

    SOAPElement.appendChild(SOAPBodyElement)
    doc.appendChild(SOAPElement)

    return doc.toxml(encoding="UTF-8")

  def _get_mac_uploadkey_dict(self):
    macs = {}
    upload_keys = {}
    for key, value in self.server.config.items('EyeFiServer'):
      if key.find('upload_key_') == 0:
        index = int(key[11:])
        upload_keys[index] = value
      elif key.find('mac_') == 0:
        index = int(key[4:])
        macs[index] = value
    d = {}
    for key in macs.keys():
      d[macs[key]] = upload_keys[key]
    return d
     
  def startSession(self, postData):  
    eyeFiLogger.debug("Delegating the XML parsing of startSession postData to EyeFiContentHandler()")
    handler = EyeFiContentHandler()
    parser = xml.sax.parseString(postData,handler)
    
    eyeFiLogger.debug("Extracted elements: " + str(handler.extractedElements))
    
    # Retrieve it from C:\Documents and Settings\<User>\Application Data\Eye-Fi\Settings.xml
    mac_to_uploadkey_map = self._get_mac_uploadkey_dict()
    mac = handler.extractedElements["macaddress"]
    upload_key = mac_to_uploadkey_map[mac]
    eyeFiLogger.debug("Got MAC address of " + mac)
    eyeFiLogger.debug("Setting Eye-Fi upload key to " + upload_key)
    
    credentialString = mac + handler.extractedElements["cnonce"] + upload_key
    eyeFiLogger.debug("Concatenated credential string (pre MD5): " + credentialString)

    # Return the binary data represented by the hexadecimal string
    # resulting in something that looks like "\x00\x18V\x03\x04..."
    binaryCredentialString = binascii.unhexlify(credentialString)

    # Now MD5 hash the binary string
    m = hashlib.md5()
    m.update(binaryCredentialString)

    # Hex encode the hash to obtain the final credential string
    credential = m.hexdigest()

    # Create the XML document to send back
    doc = xml.dom.minidom.Document()

    SOAPElement = doc.createElementNS("http://schemas.xmlsoap.org/soap/envelope/","SOAP-ENV:Envelope")
    SOAPElement.setAttribute("xmlns:SOAP-ENV","http://schemas.xmlsoap.org/soap/envelope/")    
    SOAPBodyElement = doc.createElement("SOAP-ENV:Body")


    startSessionResponseElement = doc.createElement("StartSessionResponse")
    startSessionResponseElement.setAttribute("xmlns","http://localhost/api/soap/eyefilm")

    credentialElement = doc.createElement("credential")
    credentialElementText = doc.createTextNode(credential)
    credentialElement.appendChild(credentialElementText)

    snonceElement = doc.createElement("snonce")
    snonceElementText = doc.createTextNode("99208c155fc1883579cf0812ec0fe6d2")
    snonceElement.appendChild(snonceElementText)

    transfermodeElement = doc.createElement("transfermode")
    transfermodeElementText = doc.createTextNode("2")
    transfermodeElement.appendChild(transfermodeElementText)

    transfermodetimestampElement = doc.createElement("transfermodetimestamp")
    transfermodetimestampElementText = doc.createTextNode("1230268824")
    transfermodetimestampElement.appendChild(transfermodetimestampElementText)

    upsyncallowedElement = doc.createElement("upsyncallowed")
    upsyncallowedElementText = doc.createTextNode("false")
    upsyncallowedElement.appendChild(upsyncallowedElementText)


    startSessionResponseElement.appendChild(credentialElement)
    startSessionResponseElement.appendChild(snonceElement)
    startSessionResponseElement.appendChild(transfermodeElement)
    startSessionResponseElement.appendChild(transfermodetimestampElement)
    startSessionResponseElement.appendChild(upsyncallowedElement)

    SOAPBodyElement.appendChild(startSessionResponseElement)

    SOAPElement.appendChild(SOAPBodyElement)
    doc.appendChild(SOAPElement)


    return doc.toxml(encoding="UTF-8")

def stopEyeFi():
    configfile = sys.argv[2]
    eyeFiLogger.info("Reading config " + configfile)

    config = ConfigParser.SafeConfigParser()
    config.read(configfile)

    port = config.getint('EyeFiServer','host_port')

    """send QUIT request to http server running on localhost:<port>"""
    conn = httplib.HTTPConnection("127.0.0.1:%d" % port)
    conn.request("QUIT", "/")
    conn.getresponse()

eyeFiServer=''

def runEyeFi():

  configfile = sys.argv[2]
  eyeFiLogger.info("Reading config " + configfile)

  config = ConfigParser.SafeConfigParser()
  config.read(configfile)

  # open file logging
  logfile = sys.argv[3]
  fileHandler = logging.handlers.TimedRotatingFileHandler(logfile, "D", 7, backupCount=7, encoding=None)
  fileHandler.setFormatter(eyeFiLoggingFormat)
  eyeFiLogger.addHandler(fileHandler)


  server_address = (config.get('EyeFiServer','host_name'), config.getint('EyeFiServer','host_port'))

  # run webserver as www-data - cant get it working
  #if config.get('EyeFiServer','user_id')!='':
  #  os.setuid(config.getint('EyeFiServer','user_id'))

  try:
    # Create an instance of an HTTP server. Requests will be handled
    # by the class EyeFiRequestHandler
    eyeFiServer = EyeFiServer(server_address, EyeFiRequestHandler)
    eyeFiServer.config = config

    # Spawn a new thread for the server    
    # thread.start_new_thread(eyeFiServer.serve, ())
    # eyeFiLogger.info("Eye-Fi server started listening on port " + str(server_address[1]))

    eyeFiLogger.info("Eye-Fi server started listening on port " + str(server_address[1]))
    eyeFiServer.serve_forever() 

    #raw_input("\nPress <RETURN> to stop server\n")
    #eyeFiServer.stop()
    #eyeFiLogger.info("Eye-Fi server stopped")
    #eyeFiServer.socket.close()

  except KeyboardInterrupt:
    #eyeFiServer.socket.close()
    pass



  #eyeFiLogger.info("Eye-Fi server stopped")

class MyDaemon(Daemon):
  def run(self):
    runEyeFi()

def main():
  pid_file = '/tmp/eyefiserver.pid'
  result = 0
  if len(sys.argv) > 2:
    if 'start' == sys.argv[1]:
      daemon = MyDaemon(pid_file)
      result = daemon.start()
    elif 'stop' == sys.argv[1]:
      daemon = MyDaemon(pid_file)
      result = daemon.stop()
    elif 'restart' == sys.argv[1]:
      daemon = MyDaemon(pid_file)
      result = daemon.restart()
    elif 'reload' == sys.argv[1]:
      daemon = MyDaemon(pid_file)
      result = daemon.reload()
    elif 'instance' == sys.argv[1]:
      runEyeFi()
    else:
      print "Unknown command"
      sys.exit(2)
    sys.exit(result)
  else:
    print "usage: %s start|stop|restart|reload|instance conf_file log_file" % sys.argv[0]
    sys.exit(2)

if __name__ == "__main__":
  main()
