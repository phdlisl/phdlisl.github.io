# convert

`convert`

```c
extern void  convert(_MIPT_ int,big);
```

函数功能：将有符号`int`类型数据转换为`big`类型数据。

参数：`_MIPD_`：可能为空，非空为`miracl *`类型。

参数`n`：`int`类型数据。

参数`x`：`big`类型数据。

## 源码分析


```c
void convert(_MIPD_ int n ,big x)
{  /*  convert signed integer n to big number format  */
    mr_lentype s;

#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (n==0) {zero(x); return;}
    s=0;
    if (n<0)
    {
        s=MR_MSBIT;
        n=(-n);
    }
    uconvert(_MIPP_ (unsigned int)n,x);
    x->len|=s;
}
```