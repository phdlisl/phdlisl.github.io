# uconvert

`uconvert`

```c
extern void  uconvert(_MIPT_ unsigned int,big);
```

函数功能：将无符号`int`类型数据转换为`big`类型数据。

参数：`_MIPD_`：可能为空，非空为`miracl *`类型。

参数`n`：`unsigned`类型数据。

参数`x`：`big`类型数据。

##源码分析


```c
void uconvert(_MIPD_ unsigned int n ,big x)
{  /*  convert unsigned integer n to big number format  */
    int m;
#ifdef MR_FP
    mr_small dres;
#endif
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    zero(x);
    if (n==0) return;
    
    m=0;
#ifndef MR_SIMPLE_BASE
    if (mr_mip->base==0)
    {
#endif
#ifndef MR_NOFULLWIDTH
#if MR_IBITS > MIRACL
        while (n>0)
        {
            x->w[m++]=(mr_small)(n%((mr_small)1<<(MIRACL)));
            n/=((mr_small)1<<(MIRACL));
        }
#else
        x->w[m++]=(mr_small)n;
#endif
#endif
#ifndef MR_SIMPLE_BASE
    }
    else while (n>0)
    {
        x->w[m++]=MR_REMAIN((mr_small)n,mr_mip->base);
		n=(unsigned int)((mr_small)n/mr_mip->base);
    }
#endif
    x->len=m;
}
```