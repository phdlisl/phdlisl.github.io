# ECn::iszero


```c
BOOL iszero() const;
```


```c
BOOL ECn::iszero() const
        {if (p->marker==MR_EPOINT_INFINITY) return TRUE; return FALSE;}
```