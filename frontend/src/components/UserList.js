import {Fragment, useState} from 'react'
import {Listbox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'
import {useSelector} from "react-redux";

// <1> The formatting of the Listbox is taken from: https://headlessui.com/react/listbox

const UserList = ({items, onChange}) => {
    const loggedInUser = useSelector(state => state.loggedInUser);
    const [selected, setSelected] = useState( {id:loggedInUser.id, username:loggedInUser.username, isJournalist:loggedInUser.isJournalist});
    onChange(selected);

    function onChangeDo(changeVal){
        setSelected(changeVal);
        onChange(changeVal);
    }


    // <1> Start
    return (
        <div className="w-72 border rounded">
            <Listbox value={selected} onChange={onChangeDo}>
                <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">{selected.username}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
					        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
                        </span>
                    </Listbox.Button>
                    <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {items.map((item, itemIdx) => (
                                <Listbox.Option key={item.id} value={item}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'}`
                                    }
                                >
                                    {({ selected }) => (
                                        <>
						                <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {item.isJournalist===1 ? "(J)" : ""} {item.username}
                                        </span>
                                        {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
							                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
						                    </span>
                                        ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
    // <1> End
};

export default UserList;




