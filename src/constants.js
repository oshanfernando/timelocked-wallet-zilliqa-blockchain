export const WALLETSTORE_CONTRACT_ADDR = '0x291a62b8ee7c139b59fda1d4f08ea4916ff169d7';
export const VIEWBLOCK_URL = 'https://viewblock.io/zilliqa/address/';

export const scillaContractCode = `scilla_version 0

import BoolUtils

(***************************************************)
(*                     Library                     *)
(***************************************************)

library TimeLockedWallet

let calc_tg_block =
  fun(current_block: BNum) =>
  fun(num_blocks: Uint32) =>
    builtin badd current_block num_blocks

let check_target_block_passed =
  fun(current_block: BNum) =>
  fun(target_block: BNum) =>
    let passed = builtin blt target_block current_block in
    let eq_block = builtin eq target_block current_block in
    orb passed eq_block

let construct_message =
  fun (msg : Message) =>
    let nil_msg = Nil {Message} in
    Cons {Message} msg nil_msg

type Error =
| CodeNotOwner
| CodeNotAuthorized
| CodeCannotWithdraw


(***************************************************)
(*                Contract Definition              *)
(***************************************************)
contract TimeLockedWallet(owner: ByStr20, beneficiary: ByStr20, num_blocks: Uint32)

field target_block: BNum = calc_tg_block _creation_block num_blocks


(***************************************************)
(*                    Procedures                   *)
(***************************************************)

procedure ThrowError(err: Error)
  error_code = match err with
      | CodeNotOwner => Int32 -1
      | CodeNotAuthorized => Int32 -2
      | CodeCannotWithdraw => Int32 -3
    end;
  e = { _exception : "Error"; code: error_code};
  throw e
end

procedure CheckIfOwner()
  is_owner = builtin eq _sender owner;
    match is_owner with
      | True =>
      | False =>
        err = CodeNotOwner;
        ThrowError err
    end
end

procedure IsAuthorized()
is_authorized = builtin eq _sender beneficiary;
  match is_authorized with
    | True =>
    | False =>
      err = CodeNotAuthorized;
      ThrowError err
  end
end

(***************************************************)
(*                    Transitions                  *)
(***************************************************)

transition DepositFunds()
  accept
end

transition ChangeTargetBlock(new_num_blocks: Uint32)
  CheckIfOwner;
  current_block <- & BLOCKNUMBER;
  new_block = builtin badd current_block new_num_blocks;
  target_block := new_block;

  e = {
    _eventname: "ChangeTargetBlock";
    status: "SUCCESS";
    new_block : new_block
  };
  event e
end

transition WithdrawFunds()
  IsAuthorized;
  cb <- & BLOCKNUMBER;
  tb <- target_block;
  block_passed = check_target_block_passed cb tb;
  balance <- _balance;

  match block_passed with
    | True =>
        msg = {
          _tag: "";
          _recipient: beneficiary;
          _amount: balance
        };
        msgs = construct_message msg;
        send msgs;

        e = {
          _eventname: "WithdrawFunds";
          status: "SUCCESS";
          to: _sender;
          message: "Withdrawal successfull"
        };
        event e
    | False =>
        err = CodeCannotWithdraw;
        ThrowError err
  end
end
`
