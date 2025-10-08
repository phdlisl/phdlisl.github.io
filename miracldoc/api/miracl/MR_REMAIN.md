# MR_REMAIN

`MR_REMAIN`定义在`miracl.h`，计算余数。

```c
#ifdef MR_FP
#define MR_REMAIN(a,b) ((a)-(b)*MR_DIV((a),(b)))
#else
#define MR_REMAIN(a,b) ((a)%(b))
#endif
```

[MR_DIV](/parts/api/miracl/MR_DIV.md)计算商，`(a)-(b)*MR_DIV((a),(b))`就是余数。