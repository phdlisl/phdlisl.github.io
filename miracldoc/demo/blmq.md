# blmq.cpp

BLMQ来自[Efficient and Provably-Secure Identity-Based Signatures and Signcryption from Bilinear Maps](https://www.ime.usp.br/~rt/cranalysis/BarretoSignLIbert.pdf)

下面逐个测试五种曲线，建议直接从第三种曲线开始测试，解读源码，然后解析其他几种曲线。
1. 第一种和第二种曲线，没有输出有效值；
2. 第三种曲线输出了有效值；
3. 第四种和第五种曲线，在编译的时候有错误。

<!-- MR_PAIRING_CP -->
## MR_PAIRING_CP curve

准备文件

```c
Makefile	blmq.cpp	ecn.h		mirdef.h	zzn2.cpp
big.cpp		cp_pair.cpp	miracl.a	zzn.cpp		zzn2.h
big.h		ecn.cpp		miracl.h	zzn.h
```

Makefile

```c
blmq : miracl.a big.o blmq.o cp_pair.o ecn.o zzn.o zzn2.o
	g++ -o blmq miracl.a big.o blmq.o cp_pair.o ecn.o zzn.o zzn2.o

big.o : big.cpp
	g++ -c -o big.o big.cpp

blmq.o : blmq.cpp
	g++ -c -o blmq.o blmq.cpp

cp_pair.o : cp_pair.cpp
	g++ -c -o cp_pair.o cp_pair.cpp

ecn.o : ecn.cpp
	g++ -c -o ecn.o ecn.cpp

zzn.o : zzn.cpp
	g++ -c -o zzn.o zzn.cpp

zzn2.o : zzn2.cpp
	g++ -c -o zzn2.o zzn2.cpp

clean :
	rm -f *.o blmq
```

选择参数

```c
//********* choose just one of these pairs **********
#define MR_PAIRING_CP      // AES-80 security   
#define AES_SECURITY 80
```

编译之后，有错误提示信息，需要`pairing_3.h`文件，加入该头文件。

```c
% make
g++ -c -o big.o big.cpp
g++ -c -o blmq.o blmq.cpp
blmq.cpp:50:10: fatal error: 'pairing_3.h' file not found
#include "pairing_3.h"
         ^~~~~~~~~~~~~
1 error generated.
make: *** [blmq.o] Error 1
```

再次编译，有错误提示：需要`ecn2.h`，加入`ecn2.h`和`ecn2.cpp`。

```c
% make
g++ -c -o big.o big.cpp
g++ -c -o blmq.o blmq.cpp
In file included from blmq.cpp:50:
./pairing_3.h:77:10: fatal error: 'ecn2.h' file not found
#include "ecn2.h"       // G2
         ^~~~~~~~
1 error generated.
make: *** [blmq.o] Error 1
```

再次编译，有错误提示：需要`zzn12a.h`，加入`zzn12a.h`和`zzn12a.cpp`。

```c
% make
g++ -c -o big.o big.cpp
g++ -c -o blmq.o blmq.cpp
In file included from blmq.cpp:50:
./pairing_3.h:78:10: fatal error: 'zzn12a.h' file not found
#include "zzn12a.h"     // GT
         ^~~~~~~~~~
1 error generated.
make: *** [blmq.o] Error 1
```

再次编译，有错误提示：需要`zzn4.h`，加入`zzn4.h`和`zzn4.cpp`。

```c
% make
g++ -c -o big.o big.cpp
g++ -c -o blmq.o blmq.cpp
In file included from blmq.cpp:50:
In file included from ./pairing_3.h:78:
./zzn12a.h:65:10: fatal error: 'zzn4.h' file not found
#include "zzn4.h"
         ^~~~~~~~
1 error generated.
make: *** [blmq.o] Error 1
```

再次编译

```c
% make
g++ -c -o big.o big.cpp
g++ -c -o blmq.o blmq.cpp
g++ -c -o cp_pair.o cp_pair.cpp
g++ -c -o ecn.o ecn.cpp
g++ -c -o zzn.o zzn.cpp
g++ -c -o zzn2.o zzn2.cpp
g++ -o blmq miracl.a big.o blmq.o cp_pair.o ecn.o zzn.o zzn2.o
```

执行

```c
% ./blmq 
No suitable curve available
```

<!-- MR_PAIRING_MNT -->
## MR_PAIRING_MNT curve

准备文件

```c
blmq.cpp mnt_pair.cpp zzn6a.cpp ecn3.cpp zzn3.cpp zzn2.cpp big.cpp zzn.cpp ecn.cpp
```

Makefile

```c
blmq : miracl.a big.o blmq.o ecn.o zzn.o zzn2.o mnt_pair.o zzn6a.o ecn3.o zzn3.o
	g++ -o blmq miracl.a big.o blmq.o ecn.o zzn.o zzn2.o mnt_pair.o zzn6a.o ecn3.o zzn3.o
```

编译

```c
% make
g++ -c -o big.o big.cpp
g++ -c -o blmq.o blmq.cpp
g++ -c -o ecn.o ecn.cpp
g++ -c -o zzn.o zzn.cpp
g++ -c -o zzn2.o zzn2.cpp
g++ -c -o mnt_pair.o mnt_pair.cpp
g++ -c -o zzn6a.o zzn6a.cpp
g++ -c -o ecn3.o ecn3.cpp
g++ -c -o zzn3.o zzn3.cpp
g++ -o blmq miracl.a big.o blmq.o ecn.o zzn.o zzn2.o mnt_pair.o zzn6a.o ecn3.o zzn3.o
```

执行

```c
% ./blmq 
No suitable curve available
```


<!-- MR_PAIRING_BN -->
## MR_PAIRING_BN curve

所谓BN曲线是指Barreto和Naehrig设计的曲线，即[Pairing-Friendly Elliptic Curves of Prime Order](https://eprint.iacr.org/2005/133.pdf)。


### 测试

```c
#define MR_PAIRING_BN    // AES-128 or AES-192 security
#define AES_SECURITY 128
// #define AES_SECURITY 192
```

添加相关文件，编辑`Makefile`

```c
blmq : miracl.a big.o blmq.o ecn.o zzn.o zzn2.o bn_pair.o zzn12a.o ecn2.o zzn4.o 
	g++ -o blmq miracl.a big.o blmq.o ecn.o zzn.o zzn2.o bn_pair.o zzn12a.o ecn2.o zzn4.o
```

编译`Makefile`，没有错误，只有一个警告提示，可以忽略。

```c
% make
g++ -c -o big.o big.cpp
g++ -c -o blmq.o blmq.cpp
g++ -c -o ecn.o ecn.cpp
g++ -c -o zzn.o zzn.cpp
g++ -c -o zzn2.o zzn2.cpp
g++ -c -o bn_pair.o bn_pair.cpp
bn_pair.cpp:1439:8: warning: assigning field to itself [-Wself-assign-field]
        mtbits=mtbits;
              ^
1 warning generated.
g++ -c -o zzn12a.o zzn12a.cpp
g++ -c -o ecn2.o ecn2.cpp
g++ -c -o zzn4.o zzn4.cpp
g++ -o blmq miracl.a big.o blmq.o ecn.o zzn.o zzn2.o bn_pair.o zzn12a.o ecn2.o zzn4.o
```

执行编译结果。

```c
% ./blmq 
Signed Message=   test message
Message is OK
Verified Message= test message
```

### 解析源码

声明`MR_PAIRING_BN`，表示调用BN曲线。

```c
#define MR_PAIRING_BN    // AES-128 or AES-192 security
#define AES_SECURITY 128
// #define AES_SECURITY 192
```

[pairing_3.h](/miracldoc/packg/pairing3h.md)关于BN曲线的定义：需要加入`zzn2.h`、`ecn2.h`、`zzn12a.h`，同时设置窗口大小和群元素类型。

```c
//k=12 BN curve
#ifdef MR_PAIRING_BN
#include "zzn2.h"
#include "ecn2.h"	// G2
#include "zzn12a.h"	// GT
#define WINDOW_SIZE 8 // window size for precomputation
#define G2_TYPE ECn2
#define G2_SUBTYPE ZZn2
#define GT_TYPE ZZn12
#define FROB_TYPE ZZn2
#endif
```

### 进入`main`函数的分析

pairing-friendly 的椭圆曲线是指有很好的嵌入度（favourable embedding degree）、很大的质数阶子群（large prime-order subgroup）。这种椭圆曲线很少，BLS曲线就是特地构造的符合条件的曲线。

```c
// AES_SECURITY 为安全级别
PFC pfc(AES_SECURITY);  // initialise pairing-friendly curve
Big order=pfc.order();
miracl* mip=get_mip();
```

[BN曲线配对](/miracldoc/packgDemo/bn_pair.md)


<!-- MR_PAIRING_KSS -->
## MR_PAIRING_KSS curve

```c
blmq : miracl.a blmq.o kss_pair.o zzn18.o zzn6.o ecn3.o zzn3.o big.o zzn.o ecn.o
	g++ -o blmq miracl.a blmq.o kss_pair.o zzn18.o zzn6.o ecn3.o zzn3.o big.o zzn.o ecn.o
```

编译之后，有大量的错误提示，都来自`kss_pair.cpp`，而且都在提示没有找到`to_binary`函数。

```c
% make
g++ -c -o big.o big.cpp
g++ -c -o blmq.o blmq.cpp
g++ -c -o ecn.o ecn.cpp
g++ -c -o zzn.o zzn.cpp
g++ -c -o kss_pair.o kss_pair.cpp
kss_pair.cpp:413:3: error: use of undeclared identifier 'to_binary'
                to_binary(a,bytes_per_big,&bytes[j],TRUE);
                ^
kss_pair.cpp:415:3: error: use of undeclared identifier 'to_binary'
                to_binary(b,bytes_per_big,&bytes[j],TRUE);
```

<!-- MR_PAIRING_BLS -->
## MR_PAIRING_BLS curve

```c
blmq : miracl.a blmq.o bls_pair.o zzn24.o zzn8.o zzn4.o zzn2.o ecn4.o big.o zzn.o
	g++ -o blmq miracl.a blmq.o bls_pair.o zzn24.o zzn8.o zzn4.o zzn2.o ecn4.o big.o zzn.o
```

编译之后有错误提示，问题集中在`bls_pair.cpp`

```c
% make
g++ -c -o blmq.o blmq.cpp
g++ -c -o bls_pair.o bls_pair.cpp
g++ -c -o zzn24.o zzn24.cpp
g++ -c -o zzn8.o zzn8.cpp
g++ -c -o zzn4.o zzn4.cpp
g++ -c -o zzn2.o zzn2.cpp
c++    -c -o ecn4.o ecn4.cpp
g++ -c -o big.o big.cpp
g++ -c -o zzn.o zzn.cpp
g++ -o blmq miracl.a blmq.o bls_pair.o zzn24.o zzn8.o zzn4.o zzn2.o ecn4.o big.o zzn.o
Undefined symbols for architecture arm64:
  "mul(Big const&, ECn const&, Big const&, ECn const&)", referenced from:
      PFC::mult(G1 const&, Big const&) in bls_pair.o
  "ECn::get(Big&, Big&) const", referenced from:
      PFC::add_to_hash(G1 const&) in bls_pair.o
      G1::spill(char*&) in bls_pair.o
  "ECn::iszero() const", referenced from:
      extract(ECn&, ZZn&, ZZn&) in bls_pair.o
  "ECn::get_point() const", referenced from:
      force(ZZn&, ZZn&, ZZn&, ECn&) in bls_pair.o
      extract(ECn&, ZZn&, ZZn&, ZZn&) in bls_pair.o
      force(ZZn&, ZZn&, ECn&) in bls_pair.o
      extract(ECn&, ZZn&, ZZn&) in bls_pair.o
      endomorph(ECn&, ZZn&) in bls_pair.o
  "operator-(ECn const&)", referenced from:
      PFC::mult(G1 const&, Big const&) in bls_pair.o
      operator-(G1 const&) in bls_pair.o
ld: symbol(s) not found for architecture arm64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
make: *** [blmq] Error 1
```



## 源码

```c
/*
   Barreto, Libert, McCullagh, Quisquater Signcryption
   http://grouper.ieee.org/groups/1363/IBC/submissions/Libert-IEEE-P1363-submission.pdf
   Section 4.2

   Uses Smart-Vercauteren idea for G2
   http://eprint.iacr.org/2005/116.pdf

   Compile with modules as specified below

   For MR_PAIRING_CP curve
   cl /O2 /GX blmq.cpp cp_pair.cpp zzn2.cpp big.cpp zzn.cpp ecn.cpp miracl.lib

   For MR_PAIRING_MNT curve
   cl /O2 /GX blmq.cpp mnt_pair.cpp zzn6a.cpp ecn3.cpp zzn3.cpp zzn2.cpp big.cpp zzn.cpp ecn.cpp miracl.lib
	
   For MR_PAIRING_BN curve
   cl /O2 /GX blmq.cpp bn_pair.cpp zzn12a.cpp ecn2.cpp zzn4.cpp zzn2.cpp big.cpp zzn.cpp ecn.cpp miracl.lib

   For MR_PAIRING_KSS curve
   cl /O2 /GX blmq.cpp kss_pair.cpp zzn18.cpp zzn6.cpp ecn3.cpp zzn3.cpp big.cpp zzn.cpp ecn.cpp miracl.lib

   For MR_PAIRING_BLS curve
   cl /O2 /GX blmq.cpp bls_pair.cpp zzn24.cpp zzn8.cpp zzn4.cpp zzn2.cpp ecn4.cpp big.cpp zzn.cpp ecn.cpp miracl.lib

   Test program 
*/

#include <iostream>
#include <ctime>

//********* choose just one of these pairs **********
//#define MR_PAIRING_CP      // AES-80 security   
//#define AES_SECURITY 80

//#define MR_PAIRING_MNT	// AES-80 security
//#define AES_SECURITY 80

#define MR_PAIRING_BN    // AES-128 or AES-192 security
#define AES_SECURITY 128
//#define AES_SECURITY 192

//#define MR_PAIRING_KSS    // AES-192 security
//#define AES_SECURITY 192

//#define MR_PAIRING_BLS    // AES-256 security
//#define AES_SECURITY 256
//*********************************************

#include "pairing_3.h"

int main()
{   
	PFC pfc(AES_SECURITY);  // initialise pairing-friendly curve
	Big order=pfc.order();
	miracl* mip=get_mip();

	Big s,x,a,b,h,c,M;
	G2 Q2,Q2pub,S2a,S2b;
	G1 Q1pub,P,S1a,S1b,S,T;
	GT g,r,rhs;
	time_t seed;

	time(&seed);
    irand((long)seed);

//setup - G2 = Q = {P,Q2)
	pfc.random(P);
	pfc.random(Q2);
	pfc.precomp_for_mult(P);
	pfc.precomp_for_mult(Q2);
	g=pfc.pairing(Q2,P);
	pfc.precomp_for_power(g);
	pfc.random(s);
	Q1pub=pfc.mult(P,s);
	Q2pub=pfc.mult(Q2,s);

//Keygen
	a=pfc.hash_to_group((char *)"Alice");
	S1a=pfc.mult(P,inverse(a+s,order));
	S2a=pfc.mult(Q2,inverse(a+s,order));
	b=pfc.hash_to_group((char *)"Bob");
	S1b=pfc.mult(P,inverse(b+s,order));
	S2b=pfc.mult(Q2,inverse(b+s,order));

//Signcrypt
	mip->IOBASE=256;
	M=(char *)"test message"; // to be signcrypted from Alice to Bob
	cout << "Signed Message=   " << M << endl;
	mip->IOBASE=16;
	
	pfc.precomp_for_mult(S1a);
	pfc.random(x);
	r=pfc.power(g,x);
	c=lxor(M,pfc.hash_to_aes_key(r));
	pfc.start_hash();
	pfc.add_to_hash(M);
	pfc.add_to_hash(r);
	h=pfc.finish_hash_to_group();
	S=pfc.mult(S1a,x+h);   
	T=pfc.mult(pfc.mult(P,b)+Q1pub,x);

//  Unsigncrypt

	pfc.precomp_for_pairing(S2b);  // Bob can precompute on his private key
	r=pfc.pairing(S2b,T);
	M=lxor(c,pfc.hash_to_aes_key(r));
	pfc.start_hash();
	pfc.add_to_hash(M);
	pfc.add_to_hash(r);
	h=pfc.finish_hash_to_group();
	rhs=pfc.pairing(pfc.mult(Q2,a)+Q2pub,S)*pfc.power(g,-h);
	mip->IOBASE=256;
	if (r==rhs)
	{
		cout << "Message is OK" << endl;
		cout << "Verified Message= " << M << endl;
	}
	else
		cout << "Message is bad    " << c << endl;

	return 0;
}
```