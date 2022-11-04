import { ethers } from 'ethers';

export function createContract(
  address: string,
  abi: any[],
  _provider: ethers.providers.Provider,
  overrides: object = {
    gasLimit: 600000,
  }
) {
  const contract = new ethers.Contract(address, abi, _provider);

  return new Proxy(
    { ...contract },
    {
      get(target, name: string) {
        const abiDescriptor = abi.find(
          (i) => i.name === name && i.type === 'function'
        );
        if (abiDescriptor) {
          return async function (...args: any) {
            if (abiDescriptor.stateMutability === 'view') {
              return target[name](...args);
            }
            const signer = (_provider as any).getSigner();
            if (abiDescriptor.inputs.length < args.length) {
              const lastArg = args[args.length - 1];
              if (typeof lastArg === 'object') {
                Object.assign(lastArg, overrides);
              }
            } else {
              args.push(overrides);
            }
            return contract.connect(signer)[name](...args);
          };
        }
        return target[name];
      },
    }
  );
}
