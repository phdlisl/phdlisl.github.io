# ECn::sub

`sub`定义在`ecn.h`，实现在`ecn.cpp`

```c
int sub(const ECn&,big *,big *ex1=NULL,big *ex2=NULL) const;
```

函数功能：椭圆曲线上两点之和。

参数`b`：`ECn`类型数据。

参数`lam`：`big`类型数据。

参数`ex1`：`big`类型数据。

参数`ex2`：`big`类型数据。

## 源码分析

```c
int ECn::sub(const ECn& b,big *lam,big *ex1,big *ex2) const
{
    int r=ecurve_sub(b.p,p); *lam=get_mip()->w8; 
    if (ex1!=NULL) *ex1=get_mip()->w7; 
    if (ex2!=NULL) *ex2=get_mip()->w6;    
    return r;
}
```

[ecurve_sub](/miracldoc/api/mrcurve/ecurve_sub.md)减法运算。