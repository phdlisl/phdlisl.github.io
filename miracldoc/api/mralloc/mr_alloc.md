# mr_alloc

`mr_alloc`定义在`miracl.h`，实现在`mralloc.c`

```c
extern void  *mr_alloc(_MIPT_ int,int);
```

函数功能：创建一个大小为$$num \times size$$字节的空间，返回`void *`类型指针。

参数`_MIPT_`：可能为空，非空为`miracl *`类型。

参数`num`：整数。

参数`size`：整数。

## 源码分析

`mr_alloc`实现的相关内容如下。

```c
void *mr_alloc(_MIPD_ int num,int size)
{
    char *p; 
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif

    if (mr_mip==NULL) 
    {
        p=(char *)calloc(num,size);
        return (void *)p;
    }
 
    if (mr_mip->ERNUM) return NULL;

    p=(char *)calloc(num,size);
    if (p==NULL) mr_berror(_MIPP_ MR_ERR_OUT_OF_MEMORY);
    return (void *)p;

}
```

[get_mip](/miracldoc/api/mrcore/get_mip.md)返回`miracl *`指针。

[mr_berror](/miracldoc/api/mrcore/mr_berror.md)按照错误类型打印提示。

`MR_ERR_OUT_OF_MEMORY`为[字符常量](/miracldoc/api/dtype/constants.md)。


