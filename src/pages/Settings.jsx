import React from 'react'
import '../styles/styles.css'
import { gqlQuery, sambaHelper, testConnection } from '../functions/gqlSambaMethods.js'
import Spinner from '../components/spinner/Spinner'
import Success from '../components/success_message/Success'
import Fail from '../components/fail_message/Fail'
import localForage from 'localforage'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { getMenu, getOrderTags } from '../functions/gqlSambaQueries'
import { MSidebar } from '../components/Sidebar'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 150,
            maxWidth: 200
        },
    },
};



const AppSettings = () => {

    const defaultValues = {
        TicketType: '',
        Terminal: '',
        EntityType: [],
        AutomationCommand: [],
        Department: '',
        EntityScreen: [],
        ScreenMenu: ''
    };


    const initialConnectionData = JSON.parse(window.localStorage.getItem('connectionData')) ?? { ipaddress: '', port: '', identifier: '', key: '' }
    const [value, setValue] = React.useState(initialConnectionData)
    const [posSettings, setPosSettings] = React.useState(null)
    const [loader, setLoader] = React.useState(false)
    const [success, setSuccess] = React.useState(false)
    const [fail, setFail] = React.useState(false)
    const [formValues, setFormValues] = React.useState(defaultValues);
    const [progress, setProgress] = React.useState(0);

    const handleChange = (e) => {
        setValue(
            {
                ...value,
                [e.target.name]: e.target.value
            }
        )
    }

    const handleChangeSettings = (e) => {
        setFormValues(
            {
                ...formValues,
                [e.target.name]: e.target.value
            }
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const fetchMenu = async () => {

        const menuStore = localForage.createInstance({
            name: "POS",
            storeName: "Menus"
        })

        const CategorieStore = localForage.createInstance({
            name: "POS",
            storeName: "Categories"
        });
        const productsStore = localForage.createInstance({
            name: "POS",
            storeName: "Products"
        });

        let menusResponse = []
        setLoader(true)
        try {
            const sambaHelperResponse = await sambaHelper()
            console.log(sambaHelperResponse)
            for (let item of sambaHelperResponse) {
                if (Object.keys(item)[0] === 'ScreenMenu') {
                    for (let menu of item['ScreenMenu']) {
                        const response = await gqlQuery(getMenu(menu['Name']))
                        const categories = response.data.getMenu.categories;
                        let temp = {}
                        temp[menu['Name']] = categories
                        menusResponse = [...menusResponse, temp]
                        // console.log(JSON.stringify(menus))
                    }
                }
            }

            let categoriesArray2 = []
            for (let menu of menusResponse) {

                const categories = menu[Object.keys(menu)[0]];

                let categoriesArray = []
                let menusArray = []
                let categoriesLength = categories.length
                let categoriesIndex = 1
                for (let categorie of categories) {
                    setProgress((categoriesIndex / categoriesLength) * 100)
                    categoriesArray = []
                    menusArray.push(categorie.name)
                    const items = categorie.menuItems;
                    for (let item of items) {
                        console.log(item)
                        if (item.product !== null) {
                            let portionsArray = [];
                            const pid = item.productId;
                            const productNames = item.product.name;
                            const price = item.product.price;
                            const barcode = item.product.barcode;
                            const portions = item.product.portions;
                            const tags = item.product.tags;
                            categoriesArray.push({ 'id': pid, 'name': productNames })
                            categoriesArray2.push({ 'id': pid, 'name': productNames })
                            for (let portion of portions) {
                                let portionObj = { ...portion }
                                const tagsResponse = await gqlQuery(getOrderTags(portion.productId, portion.name));
                                portionObj['tags'] = tagsResponse.data.getOrderTagGroups;
                                portionsArray.push(portionObj);

                            }
                            let productObj = { 'name': productNames, 'portions': portionsArray, 'price': price, 'barcode': barcode, 'tags': tags }
                            await productsStore.setItem(pid.toString(), productObj)
                        }
                    }
                    await CategorieStore.setItem(categorie.name, categoriesArray)
                    categoriesIndex++

                }

                await CategorieStore.setItem('AllProductsToSearch', categoriesArray2)
                await menuStore.setItem(Object.keys(menu)[0], menusArray)

            }
            setLoader(false)
            setSuccess(true)
        } catch (e) {
            window.alert(e)
            setLoader(false)
            setFail(true)
        }
    }

    React.useEffect(() => {
        if (success === true) {
            const successMsg = setTimeout(() => {
                setSuccess(false)
            }, 2000);
            return () => clearTimeout(successMsg);
        }
    }, [success])

    React.useEffect(() => {
        if (fail === true) {
            const failMsg = setTimeout(() => {
                setFail(false)
            }, 2000);
            return () => clearTimeout(failMsg);
        }
    }, [fail])

    React.useEffect(() => {
        const posSettings = localForage.createInstance({
            name: "POS",
            storeName: "Settings"
        })
        posSettings.getItem('settings').then((value) => {
            setPosSettings(value)
        })

        posSettings.getItem('savedSettings').then((value) => {

            if (value) {
                setFormValues(value)
            }
        })


    }, [])

    const saveConnection = async (data) => {
        setLoader(true);
        let response = await testConnection({ ipaddress: value.ipaddress, port: value.port });
        if (response === 'OK') {
            console.log(response);
            const connectionData = { ...data };
            window.localStorage.setItem('connectionData', JSON.stringify(connectionData));
            window.localStorage.removeItem('access_token');
            window.localStorage.removeItem('expiresin');
            setLoader(false);
            setSuccess(true);
        } else {
            console.log(response);
            setLoader(false);
            setFail(true);
        }

    }

    const saveSettings = async () => {
        const posSettings = localForage.createInstance({
            name: "POS",
            storeName: "Settings"
        })

        posSettings.setItem('savedSettings', formValues)
    }

    const getData = async () => {
        let temp = {}
        const posSettings = localForage.createInstance({
            name: "POS",
            storeName: "Settings"
        })

        const sambaHelperResponse = await sambaHelper()

        for (let setting of sambaHelperResponse) {
            temp[Object.keys(setting)[0]] = setting[Object.keys(setting)[0]]
        }
        console.log(temp)
        posSettings.setItem('settings', temp)
        setPosSettings(temp)
        // console.log(sambaHelperResponse)
    }


    return (
        <div>

            {loader ? <Spinner porcentage={progress} /> : null}
            {success ? <Success /> : null}
            {fail ? <Fail /> : null}
            <MSidebar />
-
            <div className='flex justify-center'>

                <div style={{ boxShadow: '0 .0625rem .375rem rgba(0,0,0,.35)', maxWidth: '31.25rem', width: '100%' }} className='mx-10 my-4 rounded-sm relative'>
                    <div style={{ backgroundColor: '#f5f3f0' }} className='py-4 pl-8 border-b-2 bg'>
                        <h2 className='font-semibold'>Connection Settings</h2>
                    </div>
                    <div className='p-8'>
                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <div className='inputgroup'>
                                <input className='inputfield' placeholder=" " type="text" name="ipaddress" value={value.ipaddress} onChange={handleChange} />
                                <label className='inputlabel'>IP Address</label>
                            </div>
                            <div className='inputgroup'>
                                <input className='inputfield' placeholder=" " type="text" name="port" value={value.port} onChange={handleChange} />
                                <label className='inputlabel'>Port</label>
                            </div>
                            <div className='inputgroup'>
                                <input className='inputfield' placeholder=" " type="text" name="identifier" value={value.identifier} onChange={handleChange} />
                                <label className='inputlabel'>Identifier</label>
                            </div>
                            <div className='inputgroup'>
                                <input className='inputfield' placeholder=" " type="text" name="key" value={value.key} onChange={handleChange} />
                                <label className='inputlabel'>Key</label>
                            </div>
                            <input className='button' type="submit" value="Save" onClick={() => saveConnection(value)} />
                        </form>

                    </div>
                </div>

            </div>
            <div className='flex justify-center'>

                <div style={{ boxShadow: '0 .0625rem .375rem rgba(0,0,0,.35)', maxWidth: '31.25rem', width: '100%' }} className='mx-10 my-4 rounded-sm relative'>
                    <div style={{ backgroundColor: '#f5f3f0' }} className='py-4 pl-8 border-b-2 bg'>
                        <h2 className='font-semibold'>Connection Settings</h2>
                    </div>
                    <div className='p-8 '>
                        <FormControl sx={{ width: '200px' }}>
                            <InputLabel id="TableEntityType">Entidad de mesa</InputLabel>
                            <Select
                                labelId="TableEntityType"
                                id="TableEntityType-select"
                                name='EntityType'
                                multiple
                                value={formValues.EntityType}
                                onChange={handleChangeSettings}
                                input={<OutlinedInput label="Entidad de mesa" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {posSettings && (posSettings['EntityType'].map((x) => (
                                    <MenuItem key={x.Name} value={x.Name}>
                                        <Checkbox checked={formValues?.EntityType.indexOf(x.Name) > -1} />
                                        <ListItemText primary={x.Name} />
                                    </MenuItem>
                                )))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: '200px' }}>
                            <InputLabel id="AutoCommand">Comandos</InputLabel>
                            <Select
                                labelId="AutoCommand"
                                id="AutoCommand-multiple"
                                name='AutomationCommand'
                                multiple
                                value={formValues.AutomationCommand}
                                onChange={handleChangeSettings}
                                input={<OutlinedInput label="Comandos" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                            >
                                {posSettings && (posSettings['AutomationCommand'].map((x) => (
                                    <MenuItem key={x.Name} value={x.Name}>
                                        <Checkbox checked={formValues?.AutomationCommand.indexOf(x.Name) > -1} />
                                        <ListItemText primary={x.Name} />
                                    </MenuItem>
                                )))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: '200px' }}>
                            <InputLabel id="terminal">Terminal</InputLabel>
                            <Select
                                labelId="terminal"
                                id="terminal-multiple-checkbox"
                                name='Terminal'
                                value={formValues.Terminal}
                                onChange={handleChangeSettings}
                                input={<OutlinedInput label="terminal" />}
                            >
                                {posSettings && (posSettings['Terminal'].map((x) => (
                                    <MenuItem key={x.Name} value={x.Name}>
                                        {x.Name}
                                    </MenuItem>
                                )))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: '200px' }}>
                            <InputLabel id="department">Departamento</InputLabel>
                            <Select
                                labelId="department"
                                id="department-multiple-checkbox"
                                name='Department'
                                value={formValues.Department}
                                onChange={handleChangeSettings}
                                input={<OutlinedInput label="Department" />}
                            >
                                {posSettings && (posSettings['Department'].map((x) => (
                                    <MenuItem key={x.Name} value={x.Name}>
                                        {x.Name}
                                    </MenuItem>
                                )))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: '200px' }}>
                            <InputLabel id="menu">Menú</InputLabel>
                            <Select
                                labelId="menu"
                                id="menu-multiple-checkbox"
                                name='ScreenMenu'
                                value={formValues.ScreenMenu}
                                onChange={handleChangeSettings}
                                input={<OutlinedInput label="ScreenMenu" />}
                            >
                                {posSettings && (posSettings['ScreenMenu'].map((x) => (
                                    <MenuItem key={x.Name} value={x.Name}>
                                        {x.Name}
                                    </MenuItem>
                                )))}
                            </Select>
                        </FormControl>

                        <FormControl sx={{ width: '200px' }}>
                            <InputLabel id="tickettype">Ticket</InputLabel>
                            <Select
                                labelId="tickettype"
                                id="tickettype-multiple-checkbox"
                                name='TicketType'
                                value={formValues.TicketType}
                                onChange={handleChangeSettings}
                                input={<OutlinedInput label="TicketType" />}
                            >
                                {posSettings && (posSettings['TicketType'].map((x) => (
                                    <MenuItem key={x.Name} value={x.Name}>
                                        {x.Name}
                                    </MenuItem>
                                )))}
                            </Select>
                        </FormControl>

                        <input className='button' type="submit" value="Obtener ajustes" onClick={() => getData(value)} />
                        <input className='button' type="submit" value="Guardar ajustes" onClick={() => saveSettings()} />
                        <input className='button' type="submit" value="Obtener menú" onClick={() => fetchMenu()} />

                    </div>


                </div>

            </div>


        </div>
    )
}

export default AppSettings