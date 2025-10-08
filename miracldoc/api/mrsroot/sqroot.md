# sqroot

`sqroot`

```c
extern BOOL  sqroot(_MIPT_ big,big,big);
```

```c
BOOL sqroot(_MIPD_ big x,big p,big w)
{ /* w = sqrt(x) mod p */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return FALSE;

    MR_IN(101)

    if (subdivisible(_MIPP_ p,2))
    { /* p must be odd */
        zero(w);
        MR_OUT
        return FALSE;
    }

    prepare_monty(_MIPP_ p);
    nres(_MIPP_ x,w);
    if (nres_sqroot(_MIPP_ w,w))
    {
        redc(_MIPP_ w,w);
        MR_OUT
        return TRUE;
    }

    zero(w);
    MR_OUT
    return FALSE;
}
```