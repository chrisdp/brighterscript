import { expect } from 'chai';

import { Parser } from '../..';
import { BrsBoolean, Int32 } from '../../../brsTypes';
import { Lexeme, Lexer } from '../../../lexer';
import { EOF, identifier, token } from '../Parser.spec';

describe('parser if statements', () => {
    let parser;

    beforeEach(() => {
        parser = new Parser();
    });

    describe('single-line if', () => {
        it('parses if only', () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.If, 'if'),
                token(Lexeme.Integer, '1', new Int32(1)),
                token(Lexeme.Less, '<'),
                token(Lexeme.Integer, '2', new Int32(2)),
                identifier('then'),
                identifier('foo'),
                token(Lexeme.Equal, '='),
                token(Lexeme.True, 'true', BrsBoolean.True),
                token(Lexeme.Newline, '\n'),
                EOF,
            ]);

            expect(errors).to.be.lengthOf(0);
            expect(statements).to.be.length.greaterThan(0);
            //expect(statements).toMatchSnapshot();
        });

        it('parses if-else', () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.If, 'if'),
                token(Lexeme.Integer, '1', new Int32(1)),
                token(Lexeme.Less, '<'),
                token(Lexeme.Integer, '2', new Int32(2)),
                identifier('Then'),
                identifier('foo'),
                token(Lexeme.Equal, '='),
                token(Lexeme.True, 'true', BrsBoolean.True),
                token(Lexeme.Else, 'else'),
                identifier('foo'),
                token(Lexeme.Equal, '='),
                token(Lexeme.False, 'true', BrsBoolean.False),
                token(Lexeme.Newline, '\n'),
                EOF,
            ]);

            expect(errors).to.be.lengthOf(0);
            expect(statements).to.be.length.greaterThan(0);
            //expect(statements).toMatchSnapshot();
        });

        it('parses if-elseif-else', () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.If, 'if'),
                token(Lexeme.Integer, '1', new Int32(1)),
                token(Lexeme.Less, '<'),
                token(Lexeme.Integer, '2', new Int32(2)),
                identifier('then'),
                identifier('foo'),
                token(Lexeme.Equal, '='),
                token(Lexeme.True, 'true', BrsBoolean.True),
                token(Lexeme.ElseIf, 'else if'),
                token(Lexeme.Integer, '1', new Int32(1)),
                token(Lexeme.Equal, '='),
                token(Lexeme.Integer, '2', new Int32(2)),
                identifier('then'),
                identifier('same'),
                token(Lexeme.Equal, '='),
                token(Lexeme.True, 'true', BrsBoolean.True),
                token(Lexeme.Else, 'else'),
                identifier('foo'),
                token(Lexeme.Equal, '='),
                token(Lexeme.True, 'true', BrsBoolean.False),
                token(Lexeme.Newline, '\n'),
                EOF,
            ]);

            expect(errors).to.be.lengthOf(0);
            expect(statements).to.be.length.greaterThan(0);
            //expect(statements).toMatchSnapshot();
        });

        it('allows \'then\' to be skipped', () => {
            let { statements, errors } = parser.parse([
                token(Lexeme.If, 'if'),
                token(Lexeme.Integer, '1', new Int32(1)),
                token(Lexeme.Less, '<'),
                token(Lexeme.Integer, '2', new Int32(2)),
                identifier('foo'),
                token(Lexeme.Equal, '='),
                token(Lexeme.True, 'true', BrsBoolean.True),
                token(Lexeme.ElseIf, 'else if'),
                token(Lexeme.Integer, '1', new Int32(1)),
                token(Lexeme.Equal, '='),
                token(Lexeme.Integer, '2', new Int32(2)),
                identifier('same'),
                token(Lexeme.Equal, '='),
                token(Lexeme.True, 'true', BrsBoolean.True),
                token(Lexeme.Else, 'else'),
                identifier('foo'),
                token(Lexeme.Equal, '='),
                token(Lexeme.False, 'false', BrsBoolean.False),
                token(Lexeme.Newline, '\n'),
                EOF,
            ]);

            expect(errors).to.be.lengthOf(0);
            expect(statements).to.be.length.greaterThan(0);
            //expect(statements).toMatchSnapshot();
        });
    });

    describe('block if', () => {
        it('parses if only', () => {
            //because the parser depends on line numbers for certain if statements, this needs to be location-aware
            let { tokens } = Lexer.scan(`
                if 1 < 2 THEN
                    foo = true
                    bar = true
                end if
            `);
            let { statements, errors } = parser.parse(tokens);

            expect(errors).to.be.lengthOf(0);
            expect(statements).to.be.length.greaterThan(0);
            //expect(statements).toMatchSnapshot();
        });

        it('parses if-else', () => {
            //this test requires token locations, so use the lexer
            let { tokens } = Lexer.scan(`
                if 1 < 2 then
                    foo = true
                else
                    foo = false
                    bar = false
                end if
            `);
            let { statements, errors } = parser.parse(tokens);

            expect(errors).to.be.lengthOf(0);
            expect(statements).to.be.length.greaterThan(0);
            //expect(statements).toMatchSnapshot();
        });

        it('parses if-elseif-else', () => {
            //this test requires token locations, so use the lexer
            let { tokens } = Lexer.scan(`
                if 1 < 2 then
                    foo = true
                else if 1 > 2 then
                    foo = 3
                    bar = true
                else
                    foo = false
                end if
            `);
            let { statements, errors } = parser.parse(tokens);

            expect(errors).to.be.lengthOf(0);
            expect(statements).to.be.length.greaterThan(0);
            //expect(statements).toMatchSnapshot();
        });

        it('allows \'then\' to be skipped', () => {
            //this test requires token locations, so use the lexer
            let { tokens } = Lexer.scan(`
                if 1 < 2
                    foo = true
                else if 1 > 2
                    foo = 3
                    bar = true
                else
                    foo = false
                end if
            `);
            let { statements, errors } = parser.parse(tokens);

            expect(errors).to.be.lengthOf(0);
            expect(statements).to.be.length.greaterThan(0);
            //expect(statements).toMatchSnapshot();
        });

        it('sets endif token properly', () => {
            //this test requires token locations, so use the lexer
            let { tokens } = Lexer.scan(`
                sub a()
                    if true then
                        print false
                    else if true then
                        print "true"
                    else
                        print "else"
                    end if 'comment
                end sub
            `);
            let { statements, errors } = parser.parse(tokens);
            expect(errors).to.be.lengthOf(0);
            expect(statements).to.be.length.greaterThan(0);

            //the endif token should be set
            expect(statements[0].func.body.statements[0].tokens.endIf).to.exist;
        });
    });

    it('supports trailing colons after conditional statements', () => {
        let { tokens } = Lexer.scan(`
            sub main()
                if 1 > 0:
                    print "positive!"
                else if 1 < 0:
                    print "negative!"
                else:
                    print "tHaT NuMbEr iS ZeRo"
                end if
            end sub
        `);
        let { statements, errors } = Parser.parse(tokens);
        expect(errors).to.be.lengthOf(0);
        expect(statements).to.be.length.greaterThan(0);
        //expect(statements).toMatchSnapshot();
    });

    it('supports trailing colons for one-line if statements', () => {
        let { tokens } = Lexer.scan(`
            if 1 < 2: return true: end if
        `);
        let { statements, errors } = Parser.parse(tokens);
        expect(errors).to.be.lengthOf(0);
        expect(statements).to.be.length.greaterThan(0);
        //expect(statements).toMatchSnapshot();
    });

    it('catches one-line if statement missing first colon', () => {
        //missing colon after 2
        let { tokens } = Lexer.scan(`
            if 1 < 2 return true : end if
        `);
        let { statements, errors } = Parser.parse(tokens);
        expect(errors).to.be.length.greaterThan(0);
        expect(statements).to.be.length.greaterThan(0);
        //expect(statements).toMatchSnapshot();
    });

    it('catches one-line if statement missing second colon', () => {
        //missing colon after `2`
        let { tokens } = Lexer.scan(`
            if 1 < 2 : return true end if
        `);
        let { statements, errors } = Parser.parse(tokens);
        expect(errors).to.be.length.greaterThan(0);
        expect(statements).to.be.length.greaterThan(0);
        //expect(statements).toMatchSnapshot();
    });

    it('catches one-line if statement with else missing colons', () => {
        //missing colon after `2`
        let { tokens } = Lexer.scan(`
            if 1 < 2 : return true: else return false end if
        `);
        let { statements, errors } = Parser.parse(tokens);
        expect(errors).to.be.length.greaterThan(0);
        expect(statements).to.be.length.greaterThan(0);
        //expect(statements).toMatchSnapshot();
    });

    it('catches one-line if statement with colon and missing end if', () => {
        //missing colon after `2`
        let { tokens } = Lexer.scan(`
            if 1 < 2: return true
        `);
        let { statements, errors } = Parser.parse(tokens);
        expect(errors).to.be.length.greaterThan(0);
        expect(statements).to.be.lengthOf(0);
        //expect(statements).toMatchSnapshot();
    });

    it('catches one-line if statement with colon and missing end if inside a function', () => {
        //missing 'end if'
        let { tokens } = Lexer.scan(`
            function missingendif()
                if true : return true
            end function
        `);
        let { statements, errors } = Parser.parse(tokens);
        expect(errors).to.be.lengthOf(1);
        expect(statements).to.be.length.greaterThan(0);
        //expect(statements).toMatchSnapshot();
    });

    it('supports if statement with condition and action on one line, but end if on separate line', () => {
        let { tokens } = Lexer.scan(`
            if 1 < 2: return true
            end if
        `);
        let { statements, errors } = Parser.parse(tokens);
        expect(errors).to.be.lengthOf(0);
        expect(statements).to.be.length.greaterThan(0);
        //expect(statements).toMatchSnapshot();
    });

    it('supports colon after return in single-line if statement', () => {
        let { tokens } = Lexer.scan(`
            if false : print "true" : end if
        `);
        let { statements, errors } = Parser.parse(tokens);
        expect(errors).to.be.lengthOf(0);
        expect(statements).to.be.length.greaterThan(0);
        //expect(statements).toMatchSnapshot();
    });

    it('supports if elseif endif single line', () => {
        let { tokens } = Lexer.scan(`
            if true: print "8 worked": else if true: print "not run": else: print "not run": end if
        `);
        let { statements, errors } = Parser.parse(tokens);
        expect(errors).to.be.lengthOf(0);
        expect(statements).to.be.length.greaterThan(0);
        //expect(statements).toMatchSnapshot();
    });

    it('supports one-line functions inside of one-line if statement', () => {
        let { tokens } = Lexer.scan(`
            if true then : test = sub() : print "yes" : end sub : end if
        `);
        let { statements, errors } = Parser.parse(tokens);
        expect(errors).to.be.lengthOf(0);
        expect(statements).to.be.length.greaterThan(0);
        //expect(statements).toMatchSnapshot();
    });

    // TODO: Improve `if` statement structure to allow a linter to require a `then` keyword for
});
