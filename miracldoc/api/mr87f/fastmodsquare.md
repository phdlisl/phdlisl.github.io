# fastmodsquare

`fastmodsquare`

```c
extern void  fastmodsquare(_MIPT_ big,big);   
```

```c
void fastmodsquare(_MIPD_ x,z)
big x,z;
{
    int ij;
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    big w0=mr_mip->w0;
    big modulus=mr_mip->modulus;
    mr_small *wg,*mg,*xg;   
    wg=w0->w;
    mg=modulus->w;
    xg=x->w;

    for (ij=2*MR_PENTIUM;ij<(int)(w0->len&MR_OBITS);ij++) w0->w[ij]=0.0;
    w0->len=2*MR_PENTIUM;

    ASM
    {
        push PDI
        push PSI

        mov PBX,xg  
        mov PSI,mg
        mov PDI,wg   

        fldz

        MODSQUARE

        pop PSI
        pop PDI
    }  
    for (ij=MR_PENTIUM;ij<(int)(z->len&MR_OBITS);ij++) z->w[ij]=0.0;
    z->len=MR_PENTIUM;

    for (ij=0;ij<MR_PENTIUM;ij++) z->w[ij]=w0->w[ij+MR_PENTIUM];
    if (z->w[MR_PENTIUM-1]==0.0) mr_lzero(z);

} 
```