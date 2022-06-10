
const { ethereum } = window;
let onboardButton;
let walletStatusText;
let walletStatusPoint;
let addressText;
let currentAccount;

const isMetaMaskInstalled = () => {
    return Boolean(ethereum && ethereum.isMetaMask);
};

const installMetaMask = () => {
    const forwarderOrigin = 'http://localhost:3000'
    const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
    onboarding.startOnboarding();
};

const connectWallet = async () => {
    try {
        await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
        console.error(error);
    }
};

const changeBtnConnectOrInstall = () => {
    let text = '';
    if(isMetaMaskInstalled()){
        text = 'Connect';
        onboardButton.onclick = connectWallet;
    } else {
        text = 'Click here to install MetaMask!';
        onboardButton.onclick = installMetaMask;
    }
    onboardButton.innerText = text;
};

const checkConnection = () => {
    ethereum
        .request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch(console.error);
};

const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
        walletStatusText.innerText = "No connected";
        walletStatusPoint.style = 'color: red';
        addressText.innerText = '';
        onboardButton.disabled = false;
    } else {
        onboardButton.disabled = true;
        walletStatusText.innerText = "Connected";
        walletStatusPoint.style = 'color: green';
        currentAccount = accounts[0];
        addressText.innerText = `Address: ${currentAccount}`;
     }
}

const accountsChangedEvent = (accounts) => {
    console.log('Accounts changed.')
    handleAccountsChanged(accounts);
};
const chainChangedEvent = (chainId) => {
    console.log('Chain changed. Chain: ' + chainId)
};

const detectWalletChanges = () => {
    detectEthereumProvider()
    .then(provider => {
        if (provider && provider.isMetaMask) {
            provider.on('accountsChanged', accountsChangedEvent);
            provider.on('chainChanged', chainChangedEvent);
            checkConnection();
        }
    });
};

const initVariables = () => {
    onboardButton = document.getElementById('myBtn');
    walletStatusText = document.getElementById('walletStatus');
    walletStatusPoint = document.getElementById('statusPoint');
    addressText = document.getElementById('address');
};

const main = () => {
    initVariables();
    changeBtnConnectOrInstall();
    detectWalletChanges();
};


window.addEventListener('DOMContentLoaded', main);



