# remain

`remain`

```c
extern int   remain(_MIPT_ big,int); 
```

```c
int remain(_MIPD_ big x,int n)
{ /* return integer remainder when x divided by n */
    int r;
    mr_lentype sx;
#ifdef MR_FP
    mr_small dres;
#endif
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return FALSE;

    MR_IN(88);

    sx=(x->len&MR_MSBIT);

    if (n==2 && MR_REMAIN(mr_mip->base,2)==0)
    { /* fast odd/even check if base is even */
        MR_OUT
        if ((int)MR_REMAIN(x->w[0],2)==0) return 0;
        else
        {
            if (sx==0) return 1;
            else       return (-1);
        } 
    }
    if (n==8 && MR_REMAIN(mr_mip->base,8)==0)
    { /* fast check */
        MR_OUT
        r=(int)MR_REMAIN(x->w[0],8);
        if (sx!=0) r=-r;
        return r;
    }
    
    copy(x,mr_mip->w0);
    r=subdiv(_MIPP_ mr_mip->w0,n,mr_mip->w0);
    MR_OUT
    return r;
}
```