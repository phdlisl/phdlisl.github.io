# comba_modsub

`comba_modsub`

```c
extern void  comba_modsub(_MIPT_ big,big,big);
```

函数功能：

参数

## 源码分析

`comba_modsub`在模板文件`mrcomba.tpl`实现。

```c
void comba_modsub(_MIPD_ big x,big y,big w)
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
#ifdef MR_FAST_MOD_ADD
    mr_small sc,t,v;
#endif
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    modulus=mr_mip->modulus;
    if (x!=w && y!=w) 
    {
        for (i=MR_COMBA;i<(w->len&MR_OBITS);i++) w->w[i]=0;   
        /* zero(w); */
    }

    a=x->w; b=y->w; c=w->w;
/*** SUBTRACTION ***/

#ifdef MR_FAST_MOD_ADD

#if MR_FAST_MOD_ADD == 1

    sc=(mr_small)0-modulus->w[0];  /* Modulus is 2^{MIRACL*MR_COMBA}-c. Here we calculate c */
    t=MR_OP(carry)&sc;
    v=w->w[0]-t;
    if (v<=w->w[0])
    {
	w->w[0]=v;
	carry=0;
    }

#endif

#if MR_FAST_MOD_ADD == 2

    t=(w->w[MR_COMBA-1]>>M1);
    v=w->w[0]-t;
    if (v<=w->w[0])
    {
        w->w[MR_COMBA-1]-=(t<<M1);
	w->w[0]=v;
	carry=0;
    }

#endif

#endif

    if (carry)
    {
        a=w->w; b=modulus->w; 
/*** INCREMENT ***/        /* add a and b, result in c */
    
    }
    w->len=MR_COMBA;
    if (w->w[MR_COMBA-1]==0) mr_lzero(w); 
}
```

