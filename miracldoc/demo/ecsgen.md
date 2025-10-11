# 剖析ecsgen.cpp文件

测试编译好的静态库，根据`linux64`的指导，测试`ecsgen`（Elliptic Curve Digital Signature Algorithm），将下面的文件放在一个目录下，其中`miracl.a`就是编译得到的静态库。

```c
Makefile	big.h		ecn.h		miracl.a	mirdef.h
big.cpp		ecn.cpp		ecsgen.cpp	miracl.h
```

## ecsgen.cpp文件源码

```c
/*
 *   Elliptic Curve Digital Signature Algorithm (ECDSA)
 *
 *
 *   This program generates one set of public and private keys in files 
 *   public.ecs and private.ecs respectively. Notice that the public key 
 *   can be much shorter in this scheme, for the same security level.
 *
 *   It is assumed that Curve parameters are to be found in file common.ecs
 *
 *   The curve is y^2=x^3+Ax+B mod p
 *
 *   The file common.ecs is presumed to exist, and to contain the domain
 *   information {p,A,B,q,x,y}, where A and B are curve parameters, (x,y) are
 *   a point of order q, p is the prime modulus, and q is the order of the 
 *   point (x,y). In fact normally q is the prime number of points counted
 *   on the curve. 
 *
 *   Requires: big.cpp ecn.cpp
 */

#include <iostream>
#include <fstream>
#include "ecn.h"

using namespace std;

// if MR_STATIC defined, it should be 20

#ifndef MR_NOFULLWIDTH
Miracl precision=20;
#else
Miracl precision(20,MAXBASE);
#endif

int main()
{
    ifstream common("common.ecs");    /* construct file I/O streams */
    ofstream public_key("public.ecs");
    ofstream private_key("private.ecs");
    int bits,ep;
    miracl *mip=&precision;

    ECn G,W;
    Big a,b,p,q,x,y,d;
    long seed;

    cout << "Enter 9 digit random number seed  = ";
    cin >> seed;
    irand(seed);

    common >> bits;
    mip->IOBASE=16;
    common >> p >> a >> b >> q >> x >> y;
    mip->IOBASE=10;

    ecurve(a,b,p,MR_PROJECTIVE);

    if (!G.set(x,y))
    {
        cout << "Problem - point (x,y) is not on the curve" << endl;
        return 0;
    }

    W=G;
    W*=q;

    if (!W.iszero())
    {
        cout << "Problem - point (x,y) is not of order q" << endl;
        return 0;
    }

/* generate public/private keys */

    d=rand(q);
 //   for (int i=0;i<=10000;i++)
    G*=d;
    ep=G.get(x);
    cout << "public key = " << ep << " " << x << endl;
    public_key << ep << " " << x << endl;
    private_key << d << endl;
    return 0;
}
```

## Makefile文件和测试


用`Makefile`管理项目，`Makefile`的内容如下。

```c
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

```c
% make
g++ -c -o big.o big.cpp
g++ -c -o ecsgen.o ecsgen.cpp
g++ -c -o ecn.o ecn.cpp
g++ -o ecsgen big.o miracl.a ecsgen.o ecn.o
```

在`Makefile`的编辑中，可能会按照如下方式编辑，导致编译出错。

```c
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

```c
Undefined symbols for architecture arm64:
  "std::__1::locale::use_facet(std::__1::locale::id&) const", referenced from:
      std::__1::ctype<char> const& std::__1::use_facet<std::__1::ctype<char> >(std::__1::locale const&) in big.o
      std::__1::ctype<char> const& std::__1::use_facet<std::__1::ctype<char> >(std::__1::locale const&) in ecsgen.o
...
```

在`linux64`的指导里面，用的是`g++`编译，`gcc`和`g++`是两个不同版本，查看版本，发现两者完全相同。

```c
% g++ -v
Configured with: --prefix=/Library/Developer/CommandLineTools/usr --with-gxx-include-dir=/Library/Developer/CommandLineTools/SDKs/MacOSX12.3.sdk/usr/include/c++/4.2.1
Apple clang version 13.0.0 (clang-1300.0.27.3)
Target: arm64-apple-darwin21.3.0
Thread model: posix
InstalledDir: /Library/Developer/CommandLineTools/usr/bin
```

为什么用gcc编译报错呢？

`gcc`是GNU开发的针对c的编译器，刚开始只支持编译c代码，随着`gcc`的发展愈发强大，后面`gcc`也支持编译`c++`、`Objective-c`和`java`等，在编译时需要通过设定参数指定编译的语言。所以后来，`gcc`默认编译的是c代码。把参数留给用户设置显然没有那么友好，于是就专门针对`c++` 开发了`g++`编译器。所以`gcc`是一个编译器集合，而`g++`是针对`c++`的编译器。因此，想要使用`gcc`编译`c++`的代码需要加上参数`-lstdc++`指令。

```c
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

```c
% ./ecsgen 
Enter 9 digit random number seed  = 322476589

MIRACL error from routine prepare_monty
              called from ecurve_init
              called from your program
Illegal modulus 
```

很可惜，并没有通过。这必然是由于`ecurve`函数调用失败导致的，而导致这个错误的原因，就是因为没有添加`common.ecs`文件，将这个文件包含进项目，再次测试，就能够得到正确结果。

```c
% ./ecsgen 
Enter 9 digit random number seed  = 384738928
public key = 1 5077662368640563685149485350869738525687256375694504212009
```

Miracl库是一个非常强大的密码库，在构建这个项目的时候，最重要的是要生成SDK，这个过程就是生成静态库的过程，常常会遇到很多问题。

主要问题就是环境因素，在`mrmuldv.any`中给出了一系列的可能环境，根据自己的机器环境，选择不同的环境代码，才能够得到自己的静态库。我想这也是为什么没有给出一个固定的SDK的原因吧，毕竟每个人的应用环境是不同的。但是，不得不说，这个SDK的搭建，确实存在很大的挑战。所以，用`Makefile`来管理所有文件，能够轻松掌握。

## 源码分析

### 密码原理

Elliptic Curve Digital Signature Algorithm (ECDSA)，椭圆曲线上的数字签名算法，假设椭圆曲线为

$$
y^2=x^3+Ax+B ~~ mod ~~ p
$$

参数$${p,A,B,q}$$在`common.ecs`里面，$$(x,y)$$为椭圆曲线上的点，取值分别为bits、p、a、b、q、x、y。

```
192
FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFFFFFFFFFFFF
-3
64210519E59C80E70FA7E9AB72243049FEB8DEECC146B9B1
FFFFFFFFFFFFFFFFFFFFFFFF99DEF836146BC9B1B4D22831
188DA80EB03090F67CBF20EB43A18800F4FF0AFD82FF1012
07192B95FFC8DA78631011ED6B24CDD573F977A11E794811
```

过程：读入椭圆曲线参数，验证椭圆曲线参数的可行性，选择私钥，计算公钥，输出公私钥。

### 实现过程

下面逐行分析ECDSA的实现过程。

```c
#ifndef MR_NOFULLWIDTH
Miracl precision=20;
#else
Miracl precision(20,MAXBASE);
#endif
```

如果定义了`MR_NOFULLWIDTH`，那么`precision`就是20，否则就是`(20,MAXBASE)`，其中`MAXBASE`在文件`mirdef.h`。

```c
#define MIRACL 32
//定义MIRACL在32位计算机上执行
#define MAXBASE ((mr_small)1<<(MIRACL-1))
```

1、读取椭圆曲线的参数。

读取文件信息，打开文件（写入公私钥）。`common`、`public_key`、`private_key`由C++提供。

```c
ifstream common("common.ecs");    /* construct file I/O streams */
ofstream public_key("public.ecs");
ofstream private_key("private.ecs");
```

2、构造椭圆曲线。

设置变量，`miracl`类型定义在`miracl.h`中。


```c
int bits,ep;
miracl *mip=&precision;
```

`ECn`类型定义在`ecn.h`，`Big`类型定义在`big.h`。

```c
ECn G,W;
Big a,b,p,q,x,y,d;
long seed;
```

3、产生一个种子，验证椭圆曲线参数的可行性。

提示输入一个9位随机数，放在`seed`中，`irand`定义在`miracl.h`中，在`mrcore.c`中实现，初始化一个随机数。

```c
cout << "Enter 9 digit random number seed  = ";
cin >> seed;
irand(seed);
```

从`common.ecs`读取相应的值。

```c
common >> bits;
mip->IOBASE=16;
common >> p >> a >> b >> q >> x >> y;
mip->IOBASE=10;
```

`ecurve`定义在`big.h`，实现在`big.cpp`，初始化一个椭圆曲线。

```c
ecurve(a,b,p,MR_PROJECTIVE);

// 获取椭圆曲线上的点(x,y)
if (!G.set(x,y))
{
    cout << "Problem - point (x,y) is not on the curve" << endl;
    return 0;
}

W=G;//赋值
W*=q;//W=q*W，非退化性验证

if (!W.iszero())
{
    cout << "Problem - point (x,y) is not of order q" << endl;
    return 0;
}
```

4、随机选择私钥，计算公钥，公私钥写入文件。

```c
/* generate public/private keys */
d=rand(q); //产生随机值，作为私钥
//   for (int i=0;i<=10000;i++)
G*=d;//G=d*G，公钥
ep=G.get(x);//获取G的横坐标
cout << "public key = " << ep << " " << x << endl;
public_key << ep << " " << x << endl;
private_key << d << endl;
```



#### 测试案例

```c
#include <iostream>
#include <fstream>

using namespace std;

int main(){
  ifstream common("common.ecs");    /* construct file I/O streams */
  ofstream public_key("public.ecs");
    ofstream private_key("private.ecs");

    int bits,ep;

    common >> bits;

    cout << bits << endl;

  return 0;
}
```
在这个案例中，主要说明C++已经提供`common`、`public_key`、`private_key`等函数等实现。
