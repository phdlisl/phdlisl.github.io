# mr_addn

`mr_addn`

函数功能：

参数：

```c
static int mr_addn(mr_small *x,mr_small *y,mr_small *z,int n)
{ /* add two arrays of length n*MR_KCM */
  /* first some macros */
    mr_small *a,*b,*c;
    mr_small carry;
#ifdef MR_ITANIUM
    register mr_small ma,u;
#endif
#ifdef MR_WIN64
    mr_small ma,u;
#endif
#ifdef MR_NOASM
    mr_large u;
#endif
    a=x; b=y; c=z;

/*** SUMMATION ***/

    return (int)carry;
}
```

