# MIRACL环境配置

本文介绍MIRACL的环境配置，目前以MacOS系统为例。

## 1 准备工作

实验运行的环境介绍。

### 1.1 系统参数

参考操作系统的相关参数：Version 21.3.0，arm64


```
% uname -a
Darwin LisldeMacBook-Pro.local 21.3.0 Darwin Kernel Version 21.3.0: Wed Jan  5 21:37:58 PST 2022; root:xnu-8019.80.24~20/RELEASE_ARM64_T8101 arm64
```

### 1.2 编译环境

本实验目前全部采用C语言编译，所以配置gcc环境。


```
% gcc -v
Configured with: --prefix=/Library/Developer/CommandLineTools/usr --with-gxx-include-dir=/Library/Developer/CommandLineTools/SDKs/MacOSX12.3.sdk/usr/include/c++/4.2.1
Apple clang version 13.0.0 (clang-1300.0.27.3)
Target: arm64-apple-darwin21.3.0
Thread model: posix
InstalledDir: /Library/Developer/CommandLineTools/usr/bin
```


### 1.3 Miracl环境

Miracl-SDK在GitHub上，[下载点这里](https://github.com/miracl/MIRACL)。目前（2024）该库已经有5年没有更新。

Miracl官方提供了一份安装[配置教程](https://github.com/miracl/MIRACL/tree/master/docs/miracl-user-manual)和一份[参考手册](https://github.com/miracl/MIRACL/tree/master/docs/miracl-explained)。

下载Miracl源文件，准备在本地安装。

### 1.4 Miracl源码结构

。。。

## 2 安装Miracl

逐步添加源文件，解析Miracl源码。

### 2.1 初始化Miracl项目

添加主要文件，编译Miracl静态库。

1. 在Miracl源文件中找到以下几个文件：`mirdef.h`、`mirdef.h64`、`mrcore.c`、`miracl.h`，复制该文件到新目录。

2. 新建文件`Makefile`，用该文件管理整个项目。

```
#生成 MIRACL 密码库的静态库
#操作环境：MacOS 64位

#ar 维护链接编辑器使用的索引库
#-c 屏蔽库创建时的正确消息提示
#-r 替换已经存在的文件
miracl.a : mrcore.o
	ar -cr miracl.a mrcore.o

#-c 表示编译并生成目标文件
#-m64 表示程序的宿主机器cpu架构是amd64
#-O0 表示没有优化, -O1 为默认值，-O3 优化级别最高
mrcore.o : mrcore.c
	gcc -c -o -m64 mrcore.o mrcore.c

clean :
	rm -f *.o *.a
```

编译`Makefile`，可能出现下面的错误提示

```
% make
gcc -c -o -m64 mrcore.o mrcore.c
clang: error: no such file or directory: 'mrcore.o'
make: *** [mrcore.o] Error 1
```

这是由于`-m64`不能被系统检测，为此，先去掉`Makefile`中的参数`-m64`。再次编译，最好的结果是打印下面的信息。

```
% make
gcc -c -o mrcore.o mrcore.c
ar -cr miracl.a mrcore.o
```

还可能出现类似下面的错误提示

```
% make
gcc -c -o mrcore.o mrcore.c
In file included from mrcore.c:45:
./miracl.h:303:31: error: expected ';' after top level declarator
    typedef unsigned mr_dltype mr_large;
```

首先看到的是`typedef unsigned mr_dltype mr_large;`，这个定义本身是没有问题的，`mr_dltype`本身就是一个声明类型，导致这个错误的原因，肯定是没有声明`mr_dltype`。所以定义`unsigned mr_dltype`的别名为`mr_large`是不可能的，后面还有很多关于`mr_large`的错误。现在需要知道`mr_dltype`在哪里定义？在`mirdef.h`有对`mr_dltype`的定义，虽然`miracl.h`有对`mirdef.h`的包含，但是依然没有起作用。

```c
#include "mirdef.h"
#define mr_dltype __int64
```

问题应该出在`__int64`的定义上，`__int64`为`long long for Unix/Linux`。`__int64`为微软MSVC定义的数据类型，`long long`为C99定义的数据类型。

#### 写一小段程序测试

```c
#include <stdio.h>

typedef long long __int64;

int main(){

  __int64 a;
  printf("%lu\n", sizeof(a));//8
  //-9223372036854775808～+9223372036854775807
  printf("%lu\n", sizeof(long));//8
  printf("%lu\n", sizeof(long long));//8
  printf("%lu\n", sizeof(int));//4
  a = 9223372036854775806;
  printf("%lld\n", a);

  return 0;
}
```

在本系统上，`long`类型和`long long`类型，都是8字节大小，所能够表示的数据范围为`-9223372036854775808～+9223372036854775807`。而且，在本系统上，`long long`类型是可用的。

现在，修改`mirdef.h`中关于`__int64`的定义

```c
// #define mr_dltype __int64   /* ... or long long for Unix/Linux */
// #define mr_unsign64 unsigned __int64
#define mr_dltype long long
#define mr_unsign64 unsigned long long
```

在`MacOS arm64`上编译，与数据类型`__int64`相关，而`__int64`类型的原本定义是`long long`类型，在`arm64`上是支持的。

修改完成之后，再次用`make`编译，是可以成功编译的。现在将其他的`.c`文件全部编译到静态库文件中。

```
mrbrick.c	mrflsh1.c	mrjack.c	mrshs.c
mrbuild.c	mrflsh2.c	mrlucas.c	mrshs256.c
mrflsh3.c	mrmonty.c	mrshs512.c
mirdef.h64	mrcrt.c		mrflsh4.c	mrmuldv.c	mrsmall.c
mraes.c		mrcurve.c	mrfpe.c		mrpi.c		mrsroot.c
mralloc.c	mrdouble.c	mrfrnd.c	mrpower.c	mrstrong.c
mrarth0.c	mrebrick.c	mrgcd.c		mrprime.c	mrxgcd.c
mrarth1.c	mrec2m.c	mrgcm.c		mrrand.c	mrzzn2.c
mrarth2.c	mrecn2.c	mrgf2m.c	mrround.c	mrzzn2b.c
mrarth3.c	mrfast.c	mrio1.c		mrscrt.c	mrzzn3.c
mrbits.c	mrflash.c	mrio2.c		mrsha3.c	mrzzn4.c
```

完成文件复制之后，编译所有文件，做成静态库，在Makefile里面添加下面内容。

```
#生成 MIRACL 密码库的静态库
#操作环境：MacOS 64位

#ar 维护链接编辑器使用的索引库
#-c 屏蔽库创建时的正确消息提示
#-r 替换已经存在的文件
miracl.a : mrcore.o mrarth0.o mrarth1.o mrarth2.o mralloc.o mrsmall.o mrio1.o mrio2.o mrgcd.o mrjack.o mrxgcd.o mrarth3.o mrbits.o mrrand.o mrprime.o mrcrt.o mrscrt.o mrmonty.o mrpower.o mrsroot.o mrcurve.o mrfast.o mrshs.o mrshs256.o mrshs512.o mrsha3.o mrfpe.o mraes.o mrgcm.o mrlucas.o mrzzn2.o mrzzn2b.o mrzzn3.o mrzzn4.o mrecn2.o mrstrong.o mrbrick.o mrebrick.o mrec2m.o mrgf2m.o mrflash.o mrfrnd.o mrdouble.o mrround.o mrbuild.o mrflsh1.o mrpi.o mrflsh2.o mrflsh3.o  mrflsh4.o mrmuldv.o
	ar -cr miracl.a mrcore.o mrarth0.o mrarth1.o mrarth2.o mralloc.o mrsmall.o mrio1.o mrio2.o mrgcd.o mrjack.o mrxgcd.o mrarth3.o mrbits.o mrrand.o mrprime.o mrcrt.o mrscrt.o mrmonty.o mrpower.o mrsroot.o mrcurve.o mrfast.o mrshs.o mrshs256.o mrshs512.o mrsha3.o mrfpe.o mraes.o mrgcm.o mrlucas.o mrzzn2.o mrzzn2b.o mrzzn3.o mrzzn4.o mrecn2.o mrstrong.o mrbrick.o mrebrick.o mrec2m.o mrgf2m.o mrflash.o mrfrnd.o mrdouble.o mrround.o mrbuild.o mrflsh1.o mrpi.o mrflsh2.o mrflsh3.o mrflsh4.o mrmuldv.o

#-c 表示编译并生成目标文件
#-m64 表示程序的宿主机器cpu架构是amd64
#-O0 表示没有优化, -O1 为默认值，-O3 优化级别最高
mrcore.o : mrcore.c
	gcc -c -o mrcore.o mrcore.c

mrarth0.o : mrarth0.c
	gcc -c -o mrarth0.o mrarth0.c

mrarth1.o : mrarth1.c
	gcc -c -o mrarth1.o mrarth1.c

mrarth2.o : mrarth2.c
	gcc -c -o mrarth2.o mrarth2.c

mralloc.o : mralloc.c
	gcc -c -o mralloc.o mralloc.c

mrsmall.o : mrsmall.c
	gcc -c -o mrsmall.o mrsmall.c

mrio1.o : mrio1.c
	gcc -c -o mrio1.o mrio1.c

mrio2.o : mrio2.c
	gcc -c -o mrio2.o mrio2.c

mrgcd.o : mrgcd.c
	gcc -c -o mrgcd.o mrgcd.c

mrjack.o : mrjack.c
	gcc -c -o mrjack.o mrjack.c

mrxgcd.o : mrxgcd.c
	gcc -c -o mrxgcd.o mrxgcd.c

mrarth3.o : mrarth3.c
	gcc -c -o mrarth3.o mrarth3.c

mrbits.o : mrbits.c
	gcc -c -o mrbits.o mrbits.c

mrrand.o : mrrand.c
	gcc -c -o mrrand.o mrrand.c

mrprime.o : mrprime.c
	gcc -c -o mrprime.o mrprime.c

mrcrt.o : mrcrt.c
	gcc -c -o mrcrt.o mrcrt.c

mrscrt.o : mrscrt.c
	gcc -c -o mrscrt.o mrscrt.c

mrmonty.o : mrmonty.c
	gcc -c -o mrmonty.o mrmonty.c

mrpower.o : mrpower.c
	gcc -c -o mrpower.o mrpower.c

mrsroot.o : mrsroot.c
	gcc -c -o mrsroot.o mrsroot.c

mrcurve.o : mrcurve.c
	gcc -c -o mrcurve.o mrcurve.c

mrfast.o : mrfast.c
	gcc -c -o mrfast.o mrfast.c

mrshs.o : mrshs.c
	gcc -c -o mrshs.o mrshs.c

mrshs256.o : mrshs256.c
	gcc -c -o mrshs256.o mrshs256.c

mrshs512.o : mrshs512.c
	gcc -c -o mrshs512.o mrshs512.c

mrsha3.o : mrsha3.c
	gcc -c -o mrsha3.o mrsha3.c

mrfpe.o : mrfpe.c
	gcc -c -o mrfpe.o mrfpe.c

mraes.o : mraes.c
	gcc -c -o mraes.o mraes.c

mrgcm.o : mrgcm.c
	gcc -c -o mrgcm.o mrgcm.c

mrlucas.o : mrlucas.c
	gcc -c -o mrlucas.o mrlucas.c

mrzzn2.o : mrzzn2.c
	gcc -c -o mrzzn2.o mrzzn2.c

mrzzn2b.o : mrzzn2b.c
	gcc -c -o mrzzn2b.o mrzzn2b.c

mrzzn3.o : mrzzn3.c
	gcc -c -o mrzzn3.o mrzzn3.c

mrzzn4.o : mrzzn4.c
	gcc -c -o mrzzn4.o mrzzn4.c

mrecn2.o : mrecn2.c
	gcc -c -o mrecn2.o mrecn2.c

mrstrong.o : mrstrong.c
	gcc -c -o mrstrong.o mrstrong.c

mrbrick.o : mrbrick.c
	gcc -c -o mrbrick.o mrbrick.c

mrebrick.o : mrebrick.c
	gcc -c -o mrebrick.o mrebrick.c

mrec2m.o : mrec2m.c
	gcc -c -o mrec2m.o mrec2m.c

mrgf2m.o : mrgf2m.c
	gcc -c -o mrgf2m.o mrgf2m.c

mrflash.o : mrflash.c
	gcc -c -o mrflash.o mrflash.c

mrfrnd.o : mrfrnd.c
	gcc -c -o mrfrnd.o mrfrnd.c

mrdouble.o : mrdouble.c
	gcc -c -o mrdouble.o mrdouble.c

mrround.o : mrround.c
	gcc -c -o mrround.o mrround.c

mrbuild.o : mrbuild.c
	gcc -c -o mrbuild.o mrbuild.c

mrflsh1.o : mrflsh1.c
	gcc -c -o mrflsh1.o mrflsh1.c

mrpi.o : mrpi.c
	gcc -c -o mrpi.o mrpi.c

mrflsh2.o : mrflsh2.c
	gcc -c -o mrflsh2.o mrflsh2.c

mrflsh3.o : mrflsh3.c
	gcc -c -o mrflsh3.o mrflsh3.c

mrflsh4.o : mrflsh4.c
	gcc -c -o mrflsh4.o mrflsh4.c

mrmuldv.o : mrmuldv.c
	gcc -c -o mrmuldv.o mrmuldv.c

clean :
	rm -f *.o *.a
```

编译之后，我们希望看到下面的结果。

```
% make
gcc -c -o mrcore.o mrcore.c
gcc -c -o mrarth0.o mrarth0.c
gcc -c -o mrarth1.o mrarth1.c
gcc -c -o mrarth2.o mrarth2.c
gcc -c -o mralloc.o mralloc.c
gcc -c -o mrsmall.o mrsmall.c
gcc -c -o mrio1.o mrio1.c
gcc -c -o mrio2.o mrio2.c
gcc -c -o mrgcd.o mrgcd.c
gcc -c -o mrjack.o mrjack.c
gcc -c -o mrxgcd.o mrxgcd.c
gcc -c -o mrarth3.o mrarth3.c
gcc -c -o mrbits.o mrbits.c
gcc -c -o mrrand.o mrrand.c
gcc -c -o mrprime.o mrprime.c
gcc -c -o mrcrt.o mrcrt.c
gcc -c -o mrscrt.o mrscrt.c
gcc -c -o mrmonty.o mrmonty.c
gcc -c -o mrpower.o mrpower.c
gcc -c -o mrsroot.o mrsroot.c
gcc -c -o mrcurve.o mrcurve.c
gcc -c -o mrfast.o mrfast.c
gcc -c -o mrshs.o mrshs.c
gcc -c -o mrshs256.o mrshs256.c
gcc -c -o mrshs512.o mrshs512.c
gcc -c -o mrsha3.o mrsha3.c
gcc -c -o mrfpe.o mrfpe.c
gcc -c -o mraes.o mraes.c
gcc -c -o mrgcm.o mrgcm.c
gcc -c -o mrlucas.o mrlucas.c
gcc -c -o mrzzn2.o mrzzn2.c
gcc -c -o mrzzn2b.o mrzzn2b.c
gcc -c -o mrzzn3.o mrzzn3.c
gcc -c -o mrzzn4.o mrzzn4.c
gcc -c -o mrecn2.o mrecn2.c
gcc -c -o mrstrong.o mrstrong.c
gcc -c -o mrbrick.o mrbrick.c
gcc -c -o mrebrick.o mrebrick.c
gcc -c -o mrec2m.o mrec2m.c
gcc -c -o mrgf2m.o mrgf2m.c
gcc -c -o mrflash.o mrflash.c
gcc -c -o mrfrnd.o mrfrnd.c
gcc -c -o mrdouble.o mrdouble.c
gcc -c -o mrround.o mrround.c
gcc -c -o mrbuild.o mrbuild.c
gcc -c -o mrflsh1.o mrflsh1.c
gcc -c -o mrpi.o mrpi.c
gcc -c -o mrflsh2.o mrflsh2.c
gcc -c -o mrflsh3.o mrflsh3.c
gcc -c -o mrflsh4.o mrflsh4.c
gcc -c -o mrmuldv.o mrmuldv.c
ar -cr miracl.a mrcore.o mrarth0.o mrarth1.o mrarth2.o mralloc.o mrsmall.o mrio1.o mrio2.o mrgcd.o mrjack.o mrxgcd.o mrarth3.o mrbits.o mrrand.o mrprime.o mrcrt.o mrscrt.o mrmonty.o mrpower.o mrsroot.o mrcurve.o mrfast.o mrshs.o mrshs256.o mrshs512.o mrsha3.o mrfpe.o mraes.o mrgcm.o mrlucas.o mrzzn2.o mrzzn2b.o mrzzn3.o mrzzn4.o mrecn2.o mrstrong.o mrbrick.o mrebrick.o mrec2m.o mrgf2m.o mrflash.o mrfrnd.o mrdouble.o mrround.o mrbuild.o mrflsh1.o mrpi.o mrflsh2.o mrflsh3.o mrflsh4.o mrmuldv.o
```

但是在编译`mrmuldv.c`的时候，可能出现这样的错误提示。

```
error: use of undeclared identifier '_asm'
```

原因在于，gcc支持`asm`，但是不支持`_asm`，所以将`mrmuldv.c`对应的定义修改

```c
// #define ASM _asm
#define ASM asm
```

出现新的错误

```
error: expected 'volatile', 'inline', 'goto', or '('
        ASM mov   eax,DWORD PTR a
```

到这里出现错误，属于汇编部分内容了。先不忙着去学习汇编，再次阅读文档发现，在`mrmuldv.any`中给出了各种环境的可能文件，例如选择`mrmuldv.g64`文件，将`mrmuldv.g64`修改为`mrmuldv.c`，然后编译，将出现类似下面的错误。

```
error: unknown register name 'rax' in asm
    : "rax","rbx","memory"
```

很明显，这是由于系统环境所导致的。选择`mrmuldv.ccc`，然后将`mrmuldv.ccc`修改为`mrmuldv.c`，再次编译应该不会出现上述问题了。

以上完成了Miracl中主要文件的静态打包。

### 2.2 测试

测试编译好的静态库，根据`linux64`的指导，测试`ecsgen`，将下面的文件放在一个目录下，其中`miracl.a`就是编译得到的静态库。

```
Makefile	big.h		ecn.h		miracl.a	mirdef.h
big.cpp		ecn.cpp		ecsgen.cpp	miracl.h
```

同样的，利用`Makefile`管理项目，`Makefile`的内容如下。

```
# 测试 ecsgen.cpp

ecsgen : big.o miracl.a ecsgen.o ecn.o
	g++ -o ecsgen big.o miracl.a ecsgen.o ecn.o

big.o : big.cpp
	g++ -c -o big.o big.cpp

ecn.o : ecn.cpp
	g++ -c -o ecn.o ecn.cpp

ecsgen.o : ecsgen.cpp
	g++ -c -o ecsgen.o ecsgen.cpp

clean :
	rm -f *.o
```

经过编译，得到下面的提示信息，表示编译通过。

```
% make
g++ -c -o big.o big.cpp
g++ -c -o ecsgen.o ecsgen.cpp
g++ -c -o ecn.o ecn.cpp
g++ -o ecsgen big.o miracl.a ecsgen.o ecn.o
```

在`Makefile`的编辑中，可能会按照如下方式编辑，导致编译出错。

```
# 测试 ecsgen.cpp

ecsgen : big.o miracl.a ecsgen.o ecn.o
  gcc -o ecsgen big.o miracl.a ecsgen.o ecn.o

big.o : big.cpp
  gcc -c -o big.o big.cpp

ecn.o : ecn.cpp
  gcc -c -o ecn.o ecn.cpp

ecsgen.o : ecsgen.cpp
  gcc -c -o ecsgen.o ecsgen.cpp

clean :
  rm -f *.o ecsgen
```

用gcc来编译，却发生了下面的错误。

```
Undefined symbols for architecture arm64:
  "std::__1::locale::use_facet(std::__1::locale::id&) const", referenced from:
      std::__1::ctype<char> const& std::__1::use_facet<std::__1::ctype<char> >(std::__1::locale const&) in big.o
      std::__1::ctype<char> const& std::__1::use_facet<std::__1::ctype<char> >(std::__1::locale const&) in ecsgen.o
...
```

在`linux64`的指导里面，用的是`g++`编译，`gcc`和`g++`是两个不同版本，查看版本，发现两者完全相同。

```
% g++ -v
Configured with: --prefix=/Library/Developer/CommandLineTools/usr --with-gxx-include-dir=/Library/Developer/CommandLineTools/SDKs/MacOSX12.3.sdk/usr/include/c++/4.2.1
Apple clang version 13.0.0 (clang-1300.0.27.3)
Target: arm64-apple-darwin21.3.0
Thread model: posix
InstalledDir: /Library/Developer/CommandLineTools/usr/bin
```

为什么用gcc编译报错呢？

`gcc`是GNU开发的针对c的编译器，刚开始只支持编译c代码，随着`gcc`的发展愈发强大，后面`gcc`也支持编译`c++`、`Objective-c`和`java`等，在编译时需要通过设定参数指定编译的语言。所以后来，`gcc`默认编译的是c代码。把参数给用户设置显然没有那么友好，于是就专门针对`c++` 开发了`g++`编译器。所以`gcc`是一个编译器集合，而`g++`是针对`c++`的编译器。因此，想要使用`gcc`编译`c++`的代码需要加上参数`-lstdc++`指令。

```
# 测试 ecsgen.cpp

ecsgen : big.o miracl.a ecsgen.o ecn.o
  gcc -lstdc++ -o ecsgen big.o miracl.a ecsgen.o ecn.o

big.o : big.cpp
  gcc -c -lstdc++ -o big.o big.cpp

ecn.o : ecn.cpp
  gcc -c -lstdc++ -o ecn.o ecn.cpp

ecsgen.o : ecsgen.cpp
  gcc -c -lstdc++ -o ecsgen.o ecsgen.cpp

clean :
  rm -f *.o ecsgen
```

执行编译后的可执行文件

```
% ./ecsgen 
Enter 9 digit random number seed  = 322476589

MIRACL error from routine prepare_monty
              called from ecurve_init
              called from your program
Illegal modulus 
```

很可惜，并没有通过。这必然是由于`ecurve`函数调用失败导致的，而导致这个错误的原因，就是因为没有添加`common.ecs`文件，将这个文件包含进项目，再次测试，就能够得到正确结果。

```
% ./ecsgen 
Enter 9 digit random number seed  = 384738928
public key = 1 5077662368640563685149485350869738525687256375694504212009
```

Miracl库是一个非常强大的密码库，在构建这个项目的时候，最重要的是要生成SDK，这个过程就是生成静态库的过程，常常会遇到很多问题。

主要问题就是环境因素，在`mrmuldv.any`中给出了一系列的可能环境，根据自己的机器环境，选择不同的环境代码，才能够得到自己的静态库。我想这也是为什么没有给出一个固定的SDK的原因吧，毕竟每个人的应用环境是不同的。但是，不得不说，这个SDK的搭建，确实存在很大的挑战。所以，用`Makefile`来管理所有文件，能够轻松掌握。



