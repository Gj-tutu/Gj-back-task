#!/bin/bash

path="static"

function f_ls(){
    echo `ls $1`
}

function f_mv(){
    echo `mv $1$2 $1$3`
}

r="{"
x_n=0
for x in $(f_ls ${path})
do
    if [ ${x_n} -ne 0 ]
    then
        r=${r}","
    fi
    r=${r}"\"${x}\":{"
    y_n=0
    for y in $(f_ls ${path}"/"${x})
    do
        if [ ${y_n} -ne 0 ]
        then
            r=${r}","
        fi
        y_t=${y%.*}
        y_t=${y_t%-*}
        y_h=${y##*-}
        r=${r}"\"${y_t}\":\"${path}"/"${x}"/"${y_h}\""
        if [ ${y} != ${y_h} ]
        then
            $(f_mv ${path}"/"${x}"/" ${y} ${y_h})
        fi
        y_n=${y_n+1}
    done
    r=${r}"}"
    x_n=${x_n+1}
done
r=${r}"}"

`echo ${r} > "./core/src/resource.json"`
