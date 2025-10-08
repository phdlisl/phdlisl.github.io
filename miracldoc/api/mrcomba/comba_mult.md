# comba_mult

`comba_mult`

```c
extern void  comba_mult(big,big,big);
```

函数功能：

参数

## 源码分析

`comba_mult`在模板文件`mrcomba.tpl`实现。

```c
/* NOTE! z must be distinct from x and y */

void comba_mult(big x,big y,big z) 
{ /* comba multiplier */
    int i;
    mr_small *a,*b,*c;
   
#ifdef MR_WIN64
    mr_small lo,hi,sumlo,sumhi,extra; 
#endif
#ifdef MR_ITANIUM
    register mr_small lo1,hi1,lo2,hi2,sumlo,sumhi,extra,ma,mb;
#else
#ifdef MR_NOASM 
 #ifdef mr_qltype
    mr_large pp1;
    mr_vlarge sum;
 #else
    register mr_small extra,s0,s1;
    mr_large pp1,pp2,sum;
 #endif
#endif
#endif
   
    for (i=2*MR_COMBA;i<(int)(z->len&MR_OBITS);i++) z->w[i]=0;
  
    z->len=2*MR_COMBA;
    a=x->w; b=y->w; c=z->w;
/*** MULTIPLY ***/      /* multiply a by b, result in c */
    if (z->w[2*MR_COMBA-1]==0) mr_lzero(z);
} 
```

