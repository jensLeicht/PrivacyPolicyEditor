% general definitions

% attributes(L) :-
% +L : list of (key,value)-pairs
% ==========
% checks a list of attributes
% ==========
attributes([H|T]) :- attribute(H), attributes(T).
attributes([]).

% ================================================================


% attribute(T) :-
% +T : a tuple (key,value)
% ==========
% checks a (key,value)-pair
% ==========
attribute((K,V)) :- string(K), value(V).

% ================================================================


% values(V) :-
% +V : a list of values
% ==========
% checks a list of values
% ==========
values([H|T]) :- value(H), values(T).
values([]).

% ================================================================


% value(V) :-
% +V : a value
% ==========
% a value can be a float, integer, or string
% ==========
value(V) :- float(V),!.
value(V) :- integer(V),!.
value(V) :- string(V),!.

% ================================================================


% tuples(T,L) :-
% +T : a list of tuples
% -L : a list of the languages of the input tuples
% ==========
% checks a list of tuples and returns a list of the contained languages
% ==========
tuples([(L,S)|T],[L|R]) :-
    tuple((L,S)),
    tuples(T,R).
tuples([],[]).

% ================================================================


% tuple(T) :-
% +T : a tuple
% ==========
% a tuple of a language handle code and a string, used for headers and descriptions
% ==========
tuple((L,T)) :-
    lang(L),
    string(T).

% ================================================================


% strings(S) :-
% +S : a list of strings
% ==========
% checks a list of strings
% ==========
strings([H|T]) :- string(H), strings(T).
strings([]).

% ================================================================


% boolean(B) :-
% +B : true or false
% ==========
% defines a boolean
% ==========
boolean(B) :- B==true,!;B==false.

% ================================================================


% TODO is this a general thing?

% concatErrors(E,S) :-
% +E : list of errors
% +S : concatenated string
% ==========
% concatenate error IDs into a single string
% ==========
concatErrors([E|EDP],S) :-
    concatErrors(EDP,SR),
    (SR\="",string_concat(SR,",",SRK);SR="",SRK=SR),
    string_concat(SRK,E,S).
concatErrors([],"").