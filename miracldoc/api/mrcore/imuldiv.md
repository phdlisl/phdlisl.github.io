# imuldiv

`imuldiv`

```c
extern mr_small imuldiv(mr_small,mr_small,mr_small,mr_small,mr_large,mr_small *);
```

```c
#ifdef MR_FP_ROUNDING

mr_small imuldiv(mr_small a,mr_small b,mr_small c,mr_small m,mr_large im,mr_small *rp)
{
    mr_small q;
    mr_large ldres,p=(mr_large)a*b+c;
    q=(mr_small)MR_LROUND(p*im);
    *rp=(mr_small)(p-(mr_large)q*m);
    return q;
}
#endif
```