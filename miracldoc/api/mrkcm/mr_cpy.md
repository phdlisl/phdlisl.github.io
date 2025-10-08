# mr_cpy

`mr_cpy`

函数功能：

参数：

```c
static void mr_cpy(mr_small *x,mr_small *z,int n)
{ /* copy an array of length n*MR_KCM */
    int m;
    for (m=0;m<n*MR_KCM;m++) z[m]=x[m];
}
```

