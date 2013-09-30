BINDIR = $(DESTDIR)/usr/bin
ETCDIR = $(DESTDIR)/etc

clean:
	rm -f *.pyc
install:
	mkdir -p $(BINDIR)
	mkdir -p $(ETCDIR)
	mkdir -p $(ETCDIR)/init.d
	mkdir -p $(DESTDIR)/usr/share/doc/eyefiserver2
	cp usr/local/bin/eyefiserver.py $(BINDIR)/eyefiserver
	cp etc/eyefiserver.conf $(ETCDIR)
	cp etc/init.d/eyefiserver $(ETCDIR)/init.d/
	cp debian/changelog $(DESTDIR)/usr/share/doc/eyefiserver2/changelog.Debian
	gzip $(DESTDIR)/usr/share/doc/eyefiserver2/changelog.Debian
uninstall:	
	rm $(BINDIR)/eyefiserver
	rm $(ETCDIR)/init.d/eyefiserver
