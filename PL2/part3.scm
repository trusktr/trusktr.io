#lang racket


(define (pMinMax L)
    (define highest 0)
    (if (list? L)
        (begin 
            (map 
                (lambda (i)
                   (when (> i highest)
                     (set! highest i)
                   )
                )
                L
            )
            highest
        )     
        (begin
            (newline)(display "The first argument must be a list.")
        )
    )
)

(define mylist '(8 867 21 65 8902 18 9 9643 4))
(display (~a "The highest in the list '(8 867 21 65 8902 18 9 9643 4) is " (pMinMax mylist)"."))
(set! mylist '(9 8671 2 06 980 9 82 72 01 3 57))
(newline)
(display (~a "The highest in the list '(9 8671 2 06 980 9 82 72 01 3 57) is " (pMinMax mylist) "."))



(define (incnth n)
    (lambda (i)
        (define (loop start end inc)
            (if (<= start end)
                (begin 
                    ;; loop body
                    (set! i (+ i (if (> n 0) 1 -1)))
                    (set! start (+ start inc))
                    (loop start end inc)
                )
                '()
            )
        )
        (loop 1 (abs n) 1)
        i
    )
)

(newline)
(display (~a "3 incremented 5 times is " ((incnth 5) 3)))
(newline)
(display (~a "3 decremented 7 times is " ((incnth -7) 3)))
