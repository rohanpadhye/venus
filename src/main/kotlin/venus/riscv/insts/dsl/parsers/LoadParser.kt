package venus.riscv.insts.dsl.parsers

import venus.riscv.InstructionField
import venus.riscv.MachineCode
import venus.riscv.Program

object LoadParser : InstructionParser {
    const val I_TYPE_MIN = -2048
    const val I_TYPE_MAX = 2047
    override operator fun invoke(prog: Program, mcode: MachineCode, args: List<String>) {
        checkArgsLength(args.size, 3)

        mcode[InstructionField.RD] = regNameToNumber(args[0])
        mcode[InstructionField.RS1] = regNameToNumber(args[2])
        mcode[InstructionField.IMM_11_0] =
            prog.getImmediate(args[1], I_TYPE_MIN, I_TYPE_MAX)
    }
}
