# 与`int`类型相关的数据类型

## `mr_small`、`mr_large`

```c
#define mr_utype int
#define mr_dltype long long

#ifdef MR_FP
  typedef mr_utype mr_small;
  #ifdef mr_dltype
  typedef mr_dltype mr_large;
  #endif
#else
  typedef unsigned mr_utype mr_small;
  #ifdef mr_dltype
    typedef unsigned mr_dltype mr_large;
  #endif
#endif
```

## `union doubleword`

`union doubleword`类型中，两个`mr_small`类型数据构造一个`mr_large`类型。

```c
union doubleword
{
    mr_large d;
    mr_small h[2];
};
```
