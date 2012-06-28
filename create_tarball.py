#!/usr/bin/env python3
import os
import shutil
import sys
import tempfile
import tarfile

SCRIPT_DIR = os.path.realpath(os.path.split(__file__)[0])
DIRS = ('usr', 'etc')
TARBALL = 'eyefiserver2-%s.tar.gz'

try:
    olddir = os.getcwd()
    os.chdir(SCRIPT_DIR)
    tempdir = tempfile.mkdtemp()
    tarball = tarfile.open(TARBALL % sys.argv[1], mode='w:gz')
    for dir in DIRS:
        shutil.copytree(dir, os.path.join(tempdir, dir))
    os.chdir(tempdir)
    for dir in DIRS:
        tarball.add(os.path.join(dir))
    tarball.close()
finally:
    os.chdir(olddir)
    if os.path.exists(tempdir):
        shutil.rmtree(tempdir)
