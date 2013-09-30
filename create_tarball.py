#!/usr/bin/env python3
import os
import shutil
import sys
import tempfile
import tarfile

SCRIPT_DIR = os.path.realpath(os.path.split(__file__)[0])
DIRS = ('usr', 'etc')
#FILES = ('Makefile',)
PKG_NAME = 'eyefiserver2'

try:
    olddir = os.getcwd()
    dirname = '%s_%s' % (PKG_NAME, sys.argv[1])
    tarfile_name = '%s.tar.gz' % dirname
    tempdir = tempfile.mkdtemp()
    tardir = os.path.join(tempdir, dirname)
    tarball = tarfile.open(tarfile_name, mode='w:gz')
    for dir in DIRS:
        shutil.copytree(dir, os.path.join(tardir, dir))
    for file in FILES:
        shutil.copyfile(file, os.path.join(tardir, file))
    os.chdir(tempdir)
    tarball.add(dirname)
    tarball.close()
finally:
    os.chdir(olddir)
    if os.path.exists(tempdir):
        shutil.rmtree(tempdir)
