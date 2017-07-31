CodeMirror.defineMode("riscv", function(config, parserConfig) {
    function regexFromWords(words, ins) {
        return new RegExp("^(?:" + words.join("|") + ")$", ins);
    }

    var instructions = regexFromWords([
        "add",
        "addi",
        "and",
        "andi",
        "auipc",
        "beq",
        "bge",
        "bgeu",
        "blt",
        "bltu",
        "bne",
        "div",
        "divu",
        "ecall",
        "jal",
        "jalr",
        "lb",
        "lbu",
        "lh",
        "lhu",
        "lui",
        "lw",
        "mul",
        "mulh",
        "mulhsu",
        "mulhu",
        "or",
        "ori",
        "rem",
        "remu",
        "sb",
        "sh",
        "slli",
        "slt",
        "slti",
        "sltiu",
        "sltu",
        "srai",
        "srli",
        "sub",
        "sw",
        "xor",
        "xori",
        /* pseudoinstructions */
        "j",
        "jr",
        "la",
        "li",
        "mv",
        "nop",
        "ret",
        /* nonstandard pseudoinstructions */
        "seq",
        "sge",
        "sgt",
        "sle",
        "sne"
    ], "i");

    var registers = regexFromWords([
        "x0", "x1", "x2", "x3", "x4", "x5", "x6", "x7", "x9", "x9", "x10", "x11", "x12", "x13", "x14", "x15",
        "x16", "x17", "x18", "x19", "x20", "x21", "x22", "x23", "x24", "x25", "x26", "x27", "x28", "x29", "x30", "x31",
        "zero", "ra", "sp", "gp", "tp", "t0", "t1", "s0", "s2", "a0", "a1", "a2", "a3", "a4", "a5",
        "a6", "a7", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "t3", "t4", "t5", "t6"
    ], "");

    var keywords = regexFromWords([ ".data", ".text", ".globl", ".float", ".double", ".asciiz" ], "i");

    function normal(stream, state) {
        var ch = stream.next();

        if (ch == "#") {
            stream.skipToEnd();
            return "comment";
        }
        
        if (ch == "\"" || ch == "'") {
            state.cur = string(ch)
            return state.cur(stream, state);
        }
        
        if (/\d/.test(ch)) {
            stream.eatWhile(/[\w.%]/);
            return "number";
        }

        if (/[.\w_]/.test(ch)) {
            stream.eatWhile(/[\w\\\-_.]/);
            return "variable";
        }

        return null;
    }

    function string(quote) {
        return function(stream, state) {
            var escaped = false, ch;
            while ((ch = stream.next()) != null) {
                if (ch == quote && !escaped) break;
                escaped = !escaped && ch == "\\";
            }
            if (!escaped) state.cur = normal;
            return "string";
        };
    }

    return {
        startState: function(basecol) {
            return { basecol: basecol || 0, indentDepth: 0, cur: normal };
        },

        token: function(stream, state) {
            if (stream.eatSpace()) return null;
            var style = state.cur(stream, state);
            var word = stream.current();
            if (style == "variable") {
                if (keywords.test(word)) style = "keyword";
                else if (instructions.test(word)) style = "builtin";
                else if (registers.test(word)) style = "variable-2";
            }
            return style;
        }
    };
});