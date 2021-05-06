import {Menu, Switch} from 'antd';
import * as React from 'react';

import {bevis} from 'common/lib/bevis';

import './index.scss';

interface Props {}

const b = bevis('navbar');

export class NavBar extends React.Component<Props> {
    state = {};

    public render(): React.ReactNode {
        return (
            <div className={b()}>
                <Menu theme="light" onClick={() => {}} selectedKeys={[]} mode="horizontal">
                    <Menu.Item key="11">Option 11</Menu.Item>
                    <Menu.Item key="12">Option 12</Menu.Item>
                </Menu>
            </div>
        );
    }
}
