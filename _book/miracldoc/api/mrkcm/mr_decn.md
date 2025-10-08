# mr_decn

`mr_decn`

函数功能：

参数：


```c
static int mr_decn(mr_small *y,mr_small *z,int n)
{ /* subtract from an array of length n*MR_KCM */
    mr_small *a,*b;
    mr_small carry;
#ifdef MR_WIN64
    mr_small ma,u;
#endif
#ifdef MR_ITANIUM
    register mr_small ma,u;
#endif
#ifdef MR_NOASM
    mr_large u;
#endif

    a=z; b=y;

/*** DECREMENTATION */

    return (int)carry;
}
```

