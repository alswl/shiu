#!/usr/bin/python2
# coding=utf-8
# author: alswl<alswlx@gmail.com>
# web site: https://github.com/alswl/sixu

import argparse
import SimpleHTTPServer
import BaseHTTPServer
import SocketServer
import logging


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

    if not isinstance(port, int):
        port = 9999
    httpd = BaseHTTPServer.HTTPServer(("", port), MyHandler)
    print 'serving at prot %d' %port
    httpd.serve_forever()

def encode_js(txt):
    """编码 js 字符串"""
    return txt.replace("'", r"\'").replace('"', r'\"')

def parse_txt(chapters):
    """转换文本到 json js"""
    src = """
var book = {
    length: %(length)s,
    indexs: [%(indexs)s],
    contents: [%(contents)s]
}"""
    indexs = ','.join(map(lambda x: "\n'" + encode_js(x[0]) + "'", chapters))
    contents = ','.join(map(lambda x: "\n'" + encode_js(x[1]) + "'", chapters))
    return src %{
        'length': len(chapters),
        'indexs': indexs,
        'contents': contents
    }

def parse_chapter(txt):
    """转换一章"""
    l = map(lambda x: x.strip(), txt.splitlines())
    l = filter(lambda x: len(x.strip()) > 0, l)
    try:
        title = l[0]
        contents = reduce(lambda x, y: x + y, l[1:])
    except IndexError:
        raise ValueError # TODO add
    return (title, contents)

def main():
    parser = argparse.ArgumentParser(
        description='manager of Sixu'
        )
    parser.add_argument('--serve', '-s',
                        action='store_true',
                        help='run static server')
    parser.add_argument('--port', '-p',
                        type=str,
                        help='static server port, default is 9999')
    parser.add_argument('--parse-txt',
                        type=argparse.FileType('r'),
                        help='generate story json from txt',
                        nargs='*')
    parser.add_argument('--parse-txt-output',
                        type=argparse.FileType('w'),
                        help='save the js of book',
                       )
    args = parser.parse_args()

    if args.serve:
        serve(args.port)
    elif args.parse_txt and args.parse_txt_output:
        chapters = map(lambda x: parse_chapter(zh2unicode(x.read())),
                       args.parse_txt)
        src = parse_txt(chapters)
        args.parse_txt_output.write(src.encode('utf-8'))
        map(lambda x: x.close(), args.parse_txt)
        args.parse_txt_output.close()
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
