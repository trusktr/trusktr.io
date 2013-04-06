#lang racket

(define (sphere-volume r)
  (/ (* 4 (* 3.14 (* r r r))) 3)
)

(display (~a "The volume of a sphere with radius " 3 " is: "))
(sphere-volume 3)
(display (~a "The volume of a sphere with radius " 2 " is: "))
(sphere-volume 2)



(define (shell-volume ir or)
  (- 
   (/ (* 4 (* 3.14 (* or or or))) 3)
   (/ (* 4 (* 3.14 (* ir ir ir))) 3)
  )
)

(newline)
(display (~a "The volume of a shell with inner radius " 2 " and outer radius " 3 " is: "))
(shell-volume 2 3)
(display (~a "The volume of a shell with inner radius " 4 " and outer radius " 5 " is: "))
(shell-volume 4 5)



(define (close?_v1 a b)
  (<= (abs (- a b)) 0.001)
)

(newline)
(display (~a "Are 2 and 3 close? " (if (close?_v1 2 3) "yes" "no")))
(newline)
(display (~a "Are 2 and 2.001 close? " (if (close?_v1 2 2.001) "yes" "no")))
(newline)



(define (close?_v2 a b limit)
  (<= (abs (- a b)) limit)
)

(newline)
(display (~a "Are 2 and 3 close? " (if (close?_v2 2 3 0.001) "yes" "no")))
(newline)
(display (~a "Are 2 and 2.001 close? " (if (close?_v2 2 2.001 0.001) "yes" "no")))
(newline)



(define (how-many a b c)
  (if (> (* b b) (* 4 a c))
      2
      (if (= (* b b) (* 4 a c))
          1
          0
      )
  )
)

(newline)
(display (~a "There are " (how-many 1 0 -1) " solutions"
             " to the quadratic equation <<x^2-1=0>>."))
(newline)
(display (~a "There are " (how-many 2 4 2) " solutions"
             " to the quadratic equation <<2x^2+4b+2=0>>."))



(define (filter-out-symbol mylist mysymbol)
  (if (list? mylist)
      (if (symbol? mysymbol)
          (begin 
            (map 
             (lambda (i)
               (when (equal? i mysymbol)
                 (set! mylist (remove i mylist))
               )
             )
             mylist
            )
            mylist
          )     
          (begin 
            (newline)(display "The second argument must be a symbol.")
          )
      )
      (begin
        (newline)(display "The first argument must be a list.")
      )
  )
)

(define mylist '(three two boo bah boo blahh boo bar))
(newline)(newline)(display (~a"The list 'mylist' consists of " mylist))
(set! mylist (filter-out-symbol mylist 'boo) )
(newline)(display (~a "After running (filter-out-symbol mylist 'boo), mylist contains " mylist))
(set! mylist (filter-out-symbol mylist 'three) )
(newline)(display (~a "After running (filter-out-symbol mylist 'three), mylist contains " mylist))
