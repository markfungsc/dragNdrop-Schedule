use std::convert::TryInto;
use solana_program::program_error::ProgramError;

use crate::error::EscrowError::InvalidInstruction;

pub enum EscrowInstruction {
    InitEscrow {
        // The amount party A expects to receive of token Y
        amount: u64
    },

    Exchange {
        // The amount the taker expected to pay 
        amount: u64
    },
    /// Cancel by initializer
    ///
    ///0. `[signer]` The account of the person initializing the escrow
    ///1. `[]` The token X account of the person initializing the escrow
    ///2. `[writable]` PDA's temp token account
    ///3. `[writable]` The escrow account holding the escrow info
    ///4. `[]` The token program
    ///5. `[]` The PDA account

    CancelEscrow {

    },
}

impl EscrowInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;

        Ok(match tag {
            0 => Self::InitEscrow {
                amount: Self::unpack_amount(rest)?,
            },
            1 => Self::Exchange {
                amount: Self::unpack_amount(rest)?,
            },
            2 => Self::CancelEscrow {},
            _ => return Err(InvalidInstruction.into()),
        })
    }

    fn unpack_amount(input: &[u8]) -> Result<u64, ProgramError> {
        let amount = input
            .get(..8)
            .and_then(|slice| slice.try_into().ok())
            .map(u64::from_le_bytes)
            .ok_or(InvalidInstruction)?;
        Ok(amount)
    }
}