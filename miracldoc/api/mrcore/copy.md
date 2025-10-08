# copy

`copy`定义在`miracl.h`

```c
extern void  copy(flash,flash);  
```

函数功能：将x轴坐标复制给y轴坐标。

参数`x`：x轴坐标。

参数`y`：y轴坐标。

## 源码分析

`copy`实现在`mrcore.c`

```c
void copy(flash x,flash y)
{  /* copy x to y: y=x  */
    int i,nx,ny;
    mr_small *gx,*gy;
    if (x==y || y==NULL) return;

    if (x==NULL)
    { 
        zero(y);
        return;
    }

#ifdef MR_FLASH    
    ny=mr_lent(y);
    nx=mr_lent(x);
#else
    ny=(y->len&(MR_OBITS));
    nx=(x->len&(MR_OBITS));
#endif

    gx=x->w;
    gy=y->w;

    for (i=nx;i<ny;i++)
        gy[i]=0;
    for (i=0;i<nx;i++)
        gy[i]=gx[i];
    y->len=x->len;

}
```

[zero](/parts/api/mrcore/zero.md)将参数设置为0。

如果是`MR_FLASH`，[mr_lent](/parts/api/mrcore/mr_lent.md)计算低位两字节与高位两字节的和，否则[MR_OBITS](/parts/api/dtype/constants.md)与参数的长度按位与运算。

