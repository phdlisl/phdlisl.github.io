# `big`、`zzn`、`flash`等类型

`big`类型定义在`miracl.h`

```c
#define mr_utype int // the underlying type is usually int

#ifdef MR_FP
  typedef mr_utype mr_small;
  #ifdef mr_dltype
  typedef mr_dltype mr_large;
  #endif
#endif

/* It might be wanted to change this to unsigned long */

typedef unsigned int mr_lentype;

struct bigtype
{
    mr_lentype len;
    mr_small *w;
};

typedef struct bigtype *big;
typedef big zzn;
typedef big flash;
```

在`miracl.h`中，对`big`、`zzn`、`flash`等类型做了定义，其实这三种类型都是`struct bigtype *`类型。由定义可知，`big`、`zzn`、`flash`等类型是两个`unsigned`类型成员的组合。
