# comba_negate

`comba_negate`

```c
extern void  comba_negate(_MIPT_ big,big);
```

函数功能：

参数

## 源码分析

`comba_negate`在模板文件`mrcomba.tpl`实现。

```c
void comba_negate(_MIPD_ big x,big w)
{ /* fast modular subtraction */
    unsigned int i;
    big modulus;
    mr_small *a,*b,*c;
    mr_small carry,su;  
#ifdef MR_WIN64
    mr_small ma,mb,u;
#endif
#ifdef MR_ITANIUM
    mr_small ma,u;
#endif
#ifdef MR_NOASM
    mr_large u;
#endif

#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    modulus=mr_mip->modulus;
    if (w!=x) 
    {
        for (i=MR_COMBA;i<(w->len&MR_OBITS);i++) w->w[i]=0;
        /* zero(w); */
    }
    a=modulus->w; b=x->w; c=w->w;

/*** SUBTRACTION ***/

    w->len=MR_COMBA;
    if (w->w[MR_COMBA-1]==0) mr_lzero(w); 
}
```