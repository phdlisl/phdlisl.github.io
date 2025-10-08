# mr_psub

`mr_psub`

```c
extern void  mr_psub(_MIPT_ big,big,big);
```

```c
void mr_psub(_MIPD_ big x,big y,big z)
{  /*  subtract two big numbers z=x-y      *
    *  where x and y are positive and x>y  */
    int i,lx,ly;
    mr_small borrow,pdiff;
    mr_small *gx,*gy,*gz;
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    lx = (int)x->len;
    ly = (int)y->len;
    if (ly>lx)
    {
        mr_berror(_MIPP_ MR_ERR_NEG_RESULT);
        return;
    }
    if (y!=z) copy(x,z);
    else ly=lx;
    z->len=lx;
    gx=x->w; gy=y->w; gz=z->w;
    borrow=0;
#ifndef MR_SIMPLE_BASE
    if (mr_mip->base==0)
    {
#endif    
        for (i=0;i<ly || borrow>0;i++)
        { /* subtract by columns */
            if (i>lx)
            {
                mr_berror(_MIPP_ MR_ERR_NEG_RESULT);
                return;
            }
            pdiff=gx[i]-gy[i]-borrow;
            if (pdiff<gx[i]) borrow=0;
            else if (pdiff>gx[i]) borrow=1;
            gz[i]=pdiff;
        }
#ifndef MR_SIMPLE_BASE
    }
    else for (i=0;i<ly || borrow>0;i++)
    { /* subtract by columns */
        if (i>lx)
        {
            mr_berror(_MIPP_ MR_ERR_NEG_RESULT);
            return;
        }
        pdiff=gy[i]+borrow;
        borrow=0;
        if (gx[i]>=pdiff) pdiff=gx[i]-pdiff;
        else
        { /* set borrow */
            pdiff=mr_mip->base+gx[i]-pdiff;
            borrow=1;
        }
        gz[i]=pdiff;
    }
#endif
    mr_lzero(z);
}
```