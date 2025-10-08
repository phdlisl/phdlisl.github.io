# irand()

`irand`定义在`miracl.h`中，在`mrcore.c`中实现。


```c
extern void  irand(_MIPT_ mr_unsign32);
```


```c
void irand(_MIPD_ mr_unsign32 seed)
{ /* initialise random number system */
    int i,in;
    mr_unsign32 t,m=1L;
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    mr_mip->borrow=0L;
    mr_mip->rndptr=0;
    mr_mip->ira[0]=seed;
    for (i=1;i<NK;i++)
    { /* fill initialisation vector */
        in=(NV*i)%NK;
        mr_mip->ira[in]=m; 
        t=m;
        m=seed-m;
        seed=t;
    }
    for (i=0;i<1000;i++) brand(_MIPPO_ ); /* "warm-up" & stir the generator */
}
```

# rand()

`rand`定义在`big.h`，实现在`big.cpp`。

```c
extern Big rand(int,int);
```

```c
Big rand(const Big& b) {Big z; bigrand(b.fn,z.fn); return z;}
Big rand(int n,int b) {Big z; bigdig(n,b,z.fn);  return z;}
```


# bigrand()和bigdig()

`bigrand`和`bigdig`定义在`big.h`，实现在`mrrand.c`。

```c
extern void  bigrand(_MIPT_ big,big);
extern void  bigdig(_MIPT_ int,int,big);
```

```c
#ifndef MR_NO_RAND

void bigrand(_MIPD_ big w,big x)
{  /*  generate a big random number 0<=x<w  */
    int m;
    mr_small r;
#ifdef MR_FP
    mr_small dres;
#endif
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return;

    MR_IN(20)

 /*   decr(_MIPP_ w,2,w);  */
    m=0;
    zero(mr_mip->w0);

    do
    { /* create big rand piece by piece */
        m++;
        mr_mip->w0->len=m;
        r=brand(_MIPPO_ );
        if (mr_mip->base==0) mr_mip->w0->w[m-1]=r;
        else                 mr_mip->w0->w[m-1]=MR_REMAIN(r,mr_mip->base);
    } while (mr_compare(mr_mip->w0,w)<0);
    mr_lzero(mr_mip->w0);
    divide(_MIPP_ mr_mip->w0,w,w);

    copy(mr_mip->w0,x);
 /*   incr(_MIPP_ x,2,x);
    if (w!=x) incr(_MIPP_ w,2,w); */
    MR_OUT
}

void bigdig(_MIPD_ int n,int b,big x)
{ /* generate random number n digits long *
   * to "printable" base b                */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return;

    MR_IN(19)

    if (b<2 || b>256)
    {
        mr_berror(_MIPP_ MR_ERR_BASE_TOO_BIG);
        MR_OUT
        return;
    }

    do
    { /* repeat if x too small */
        expint(_MIPP_ b,n,mr_mip->w1);
        bigrand(_MIPP_ mr_mip->w1,x);
        subdiv(_MIPP_ mr_mip->w1,b,mr_mip->w1);
    } while (!mr_mip->ERNUM && mr_compare(x,mr_mip->w1)<0);

    MR_OUT
}

#endif
```