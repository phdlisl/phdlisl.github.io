# 排序函数qsort

`qsort`是C标准库中提供的快速排序函数，用于对任意类型的数组进行排序。

```c
#include <stdlib.h>

void qsort(void *base, size_t nitems, size_t size, int (*compar)(const void *, const void *));
```

参数说明：

* `base`：指向要排序的数组的第一个元素的指针（数组首地址）
* `nitems`：数组中元素的个数
* `size`：每个元素的大小（以字节为单位）
* `compar`：比较函数指针，用于定义排序规则

以下案例是一个简单的整数排序，定义排序规则`compare_int`，然后通过`qsort`函数完成排序。

```c
#include <stdio.h>
#include <stdlib.h>

// 比较函数 - 升序排序
int compare_int(const void *a, const void *b) {
    const int *num1 = (const int *)a;
    const int *num2 = (const int *)b;
    
    if (*num1 < *num2) return -1;
    if (*num1 > *num2) return 1;
    return 0;
    
    // 更简洁的写法：
    // return (*(int*)a - *(int*)b);
}

// 降序排序的比较函数
int compare_int_desc(const void *a, const void *b) {
    return (*(int*)b - *(int*)a);
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    
    printf("Original array: ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    
    // 升序排序
    qsort(arr, n, sizeof(int), compare_int);
    
    printf("Sorted array (ascending): ");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    
    return 0;
}
```