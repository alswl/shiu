#!/usr/bin/python2
# coding=utf-8
# author: alswl<alswlx@gmail.com>
# web site: https://github.com/alswl/shiu

import os
import argparse
import SimpleHTTPServer
import BaseHTTPServer
import SocketServer
import logging
import json

import ConfigParser

import sys
reload(sys)
sys.setdefaultencoding('utf-8')


def zh2unicode(text):
    """
    Auto converter encodings to unicode
    It will test utf8, gbk, big5, jp, kr to converter"""
    for encoding in ('utf-8', 'gbk', 'big5', 'jp', 'euc_kr','utf16','utf32'):
        try:
            return text.decode(encoding)
        except:
            pass
    return text

def serve(port):
    """启动静态服务器"""
    class MyHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
        """为了修改 Content-type 而修改的服务器"""
        def guess_type(self, path):
            mimetype = SimpleHTTPServer.SimpleHTTPRequestHandler.guess_type(
                self, path
                )
            if mimetype == 'application/octet-stream':
                if path.endswith('manifest'):
                    mimetype = 'text/cache-manifest'
            return mimetype

    os.chdir(os.path.join(os.path.dirname(__file__), './app/'))
    if not isinstance(port, int):
        port = 9999
    httpd = BaseHTTPServer.HTTPServer(("", port), MyHandler)
    print 'serving at prot %d' %port
    httpd.serve_forever()

def encode_js(txt):
    """编码 js 字符串"""
    return txt.replace("'", r"\'").replace('"', r'\"')

class Book(object):
    def __init__(self, title, author):
        self.title = title
        self.author = author
        self.chapters = []

    def to_string(self):
        return 'var book = %s' %json.dumps(self.dic(), ensure_ascii=False,
                                          indent=2)

    def dic(self):
        return {
            'title': self.title,
            'author': self.author,
            'chapters': map(lambda x: x.dic(), self.chapters),
        }

    @staticmethod
    def parse_dir(path):
        """从某个文件夹下面的 txt生成 Book"""
        files = map(lambda x: os.path.join(path, x), os.listdir(path))
        chapters = map(lambda x: open(x, 'r'),
                       filter(lambda x: x.endswith('.txt'), files))
        chapters.sort(key=lambda x: x.name)
        config = ConfigParser.ConfigParser()
        config.read(os.path.join(path, 'info.ini'))
        book = Book(config.get('Book', 'title'),
                    config.get('Book', 'author'))
        for i, f in enumerate(chapters):
            book.chapters.append(Chapter.parse(zh2unicode(f.read()), i + 1))
            f.close()
        return book

class Chapter(object):
    def __init__(self, title, content, index=None):
        self.title = title
        self.content = content
        self.index = index

    def dic(self):
        return {
            'index': self.index,
            'title': self.title,
            'content': self.content,
        }

    @staticmethod
    def parse(txt, index):
        l = map(lambda x: x.strip(), txt.splitlines())
        l = filter(lambda x: len(x.strip()) > 0, l)
        try:
            title = l[0]
            content = reduce(lambda x, y: x + '\r' + y, l[1:])
        except IndexError:
            raise ValueError # TODO add
        return Chapter(title, content, index)

def main():
    parser = argparse.ArgumentParser(
        description='manager of Shiu'
        )
    parser.add_argument('--serve', '-s',
                        action='store_true',
                        help='run static server')
    parser.add_argument('--port', '-p',
                        type=int,
                        help='static server port, default is 9999')
    parser.add_argument('--parse-dir',
                        type=str,
                        help='generate story json from a book folder',)
    parser.add_argument('--parse-js-output',
                        type=argparse.FileType('w'),
                        help='save the js of book',)
    args = parser.parse_args()

    if args.serve:
        serve(args.port)
    elif args.parse_dir and args.parse_js_output:
        book = Book.parse_dir(args.parse_dir)

        args.parse_js_output.write(book.to_string().encode('utf-8'))
        args.parse_js_output.close()
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
