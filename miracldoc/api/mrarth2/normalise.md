# normalise

`normalise`

```c
extern mr_small normalise(_MIPT_ big,big);
```


```c
mr_small normalise(_MIPD_ big x,big y)
{ /* normalise divisor */
    mr_small norm,r;
#ifdef MR_FP
    mr_small dres;
#endif
    int len;
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif

    MR_IN(4)

    if (x!=y) copy(x,y);
    len=(int)(y->len&MR_OBITS);
#ifndef MR_SIMPLE_BASE
    if (mr_mip->base==0)
    {
#endif
#ifndef MR_NOFULLWIDTH
        if ((r=y->w[len-1]+1)==0) norm=1;
#ifdef MR_NOASM
        else norm=(mr_small)(((mr_large)1 << MIRACL)/r);
#else
        else norm=muldvm((mr_small)1,(mr_small)0,r,&r);
#endif
        if (norm!=1) mr_pmul(_MIPP_ y,norm,y);
#endif
#ifndef MR_SIMPLE_BASE
    }
    else
    {
        norm=MR_DIV(mr_mip->base,(mr_small)(y->w[len-1]+1));   
        if (norm!=1) mr_pmul(_MIPP_ y,norm,y);
    }
#endif
    MR_OUT
    return norm;
}
```

