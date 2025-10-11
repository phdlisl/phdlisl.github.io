# ecn.h 和 ecn.cpp

<!-- Definition of class ECn  (Arithmetic on an Elliptic Curve, mod n) -->

定义`ECn`类，其中“ECn”表示“Arithmetic on an Elliptic Curve, mod n”。

如果没有定义`ECN_H`，则定义`ECN_H`，防止重复定义引发冲突。包含头文件`cstring`和`big.h`，其中`<cstring>`是C语言中`<string.h>`的C++版本，主要提供了一些操作C风格字符串（即以空字符 '\0' 结尾的字符数组）的函数和工具，如`strcpy`、`strlen`、`strcat`、`strcmp`等函数都在这个头文件中声明，`<cstring>`更适合用在C语言库的兼容或性能优化；`big.h`详解参考[big.h](/miracldoc/packg/big.md)。

```c
#ifndef ECN_H
#define ECN_H

#include <cstring>
#include "big.h"
```

## MR_INIT_ECN

如果定义了`ZZNS`，则定义`MR_INIT_ECN`为`memset`，否则定义为`mem`。

```c
#ifdef ZZNS
#define MR_INIT_ECN memset(mem,0,mr_ecp_reserve(1,ZZNS)); p=(epoint *)epoint_init_mem_variable(mem,0,ZZNS); 
#else
#define MR_INIT_ECN mem=(char *)ecp_memalloc(1); p=(epoint *)epoint_init_mem(mem,0); 
#endif
```

1. 如果定义`ZZNS`，把`mem`指向的[mr_ecp_reserve](/miracldoc/api/miracl/mr_ecp_reserve.md)个字节空间初始化为0，`mem`为`char`类型数组。
[epoint_init_mem_variable](/miracldoc/api/mrcore/epoint_init_mem_variable.md)用字符数组`mem`初始化一个[epoint类型](/miracldoc/api/dtype/epoint.md)指针，也就是得到椭圆曲线的一个点。

2. 如果没有定义`ZZNS`，`mem`指向[ecp_memalloc](/miracldoc/api/mrcore/ecp_memalloc.md)分配的内存，
[epoint_init_mem](/miracldoc/api/mrcore/epoint_init_mem.md)将字符串`mem`初始化为椭圆曲线上的点。

```c
#ifdef ZZNS
    char mem[mr_ecp_reserve(1,ZZNS)];
#else
    char *mem;
#endif
```

## ECn类

如果定义`ZZNS`，则设置`mem`的大小为[mr_ecp_reserve](/miracldoc/api/miracl/mr_ecp_reserve.md)的数组，否则`mem`作为`char *`类型指针。

定义`ECn`类的构造函数，其构造函数有4个，在构造函数中用`MR_INIT_ECN`完成对`ECn`初始化，`MR_INIT_ECN`就定义在这个文件中。

[epoint_set](/miracldoc/api/mrcurve/epoint_set.md)在椭圆曲线上初始化一个点，[epoint_copy](/miracldoc/api/mrcurve/epoint_copy.md)实现椭圆曲线上两个点的复制。

[get_point](/miracldoc/api/ecn/get_point.md)取出点p，[get_status](/miracldoc/api/ecn/get_status.md)取出当前的状态。

[ecurve_add](/miracldoc/api/mrcurve/ecurve_add.md)实现椭圆曲线上的两个点相加，`pa=pa+p`。

```c
class ECn
{
    epoint *p;
#ifdef ZZNS
    char mem[mr_ecp_reserve(1,ZZNS)]; // 设置一个数组
#else
    char *mem;
#endif
public:
    ECn()                           {MR_INIT_ECN }
   
    ECn(const Big &x,const Big& y)  {MR_INIT_ECN 
                                   epoint_set(x.getbig(),y.getbig(),0,p); }
    
  // This next constructor restores a point on the curve from "compressed" 
  // data, that is the full x co-ordinate, and the LSB of y  (0 or 1)

#ifndef MR_SUPPORT_COMPRESSION
    ECn(const Big& x,int cb)             {MR_INIT_ECN
                                   epoint_set(x.getbig(),x.getbig(),cb,p); }
#endif
    
    ECn(const ECn &b)                   {MR_INIT_ECN epoint_copy(b.p,p);}

    epoint *get_point() const;
    int get_status() {return p->marker;}
    ECn& operator=(const ECn& b)  {epoint_copy(b.p,p);return *this;}

    ECn& operator+=(const ECn& b) {ecurve_add(b.p,p); return *this;}

    int add(const ECn&,big *,big *ex1=NULL,big *ex2=NULL) const; 
                                  // returns line slope as a big
    int sub(const ECn&,big *,big *ex1=NULL,big *ex2=NULL) const;         
 
    ECn& operator-=(const ECn& b) {ecurve_sub(b.p,p); return *this;}

  // Multiplication of a point by an integer. 

    ECn& operator*=(const Big& k) {ecurve_mult(k.getbig(),p,p); return *this;}

    void clear() {epoint_set(NULL,NULL,0,p);}
    BOOL set(const Big& x,const Big& y)    {return epoint_set(x.getbig(),y.getbig(),0,p);}
#ifndef MR_AFFINE_ONLY
// use with care if at all
	void setz(const Big& z) {nres(z.getbig(),p->Z); p->marker=MR_EPOINT_GENERAL;}
#endif
    BOOL iszero() const;
    int get(Big& x,Big& y) const;

  // This gets the point in compressed form. Return value is LSB of y-coordinate
    int get(Big& x) const;

  // get raw coordinates
    void getx(Big &x) const;
    void getxy(Big &x,Big &y) const;
    void getxyz(Big &x,Big &y,Big &z) const;

  // point compression

  // This sets the point from compressed form. cb is LSB of y coordinate 
#ifndef MR_SUPPORT_COMPRESSION
    BOOL set(const Big& x,int cb=0)  {return epoint_set(x.getbig(),x.getbig(),cb,p);}
#endif
    friend ECn operator-(const ECn&);
    friend void multi_add(int,ECn *,ECn *);
    friend void double_add(ECn&,ECn&,ECn&,ECn&,big&,big&);

    friend ECn mul(const Big&, const ECn&, const Big&, const ECn&);
    friend ECn mul(int, const Big *, ECn *);
  
    friend void normalise(ECn &e) {epoint_norm(e.p);}
    friend void multi_norm(int,ECn *);

    friend BOOL operator==(const ECn& a,const ECn& b)
                                  {return epoint_comp(a.p,b.p);}    
    friend BOOL operator!=(const ECn& a,const ECn& b)
                                  {return (!epoint_comp(a.p,b.p));}    

    friend ECn operator*(const Big &,const ECn&);

#ifndef MR_NO_STANDARD_IO

    friend ostream& operator<<(ostream&,const ECn&);

#endif

    ~ECn() {
#ifndef ZZNS
        mr_free(mem); 
#endif
 }

};
```

ECn实现的函数

[add](/miracldoc/api/ecn/add.md)椭圆曲线上两点之和。

[sub](/miracldoc/api/ecn/sub.md)减法运算。

[operator-](/miracldoc/api/ecn/operator-.md)

[double_add](/miracldoc/api/ecn/double_add.md)

[get](/miracldoc/api/ecn/get.md)

[getx](/miracldoc/api/ecn/getx.md)

[getxy](/miracldoc/api/ecn/getxy.md)

[getxyz](/miracldoc/api/ecn/getxyz.md)

[is_on_curve](/miracldoc/api/ecn/is_on_curve.md)

[iszero](/miracldoc/api/ecn/iszero.md)

[operator<<](/miracldoc/api/ecn/operator-lb.md)

[mul](/miracldoc/api/ecn/mul.md)

[multi_add](/miracldoc/api/ecn/multi_add.md)

[multi_norm](/miracldoc/api/ecn/multi_norm.md)

[get_point](/miracldoc/api/ecn/get_point.md)

[operator*](/miracldoc/api/ecn/operator-x.md)

[get_status](/miracldoc/api/ecn/get_status.md)



