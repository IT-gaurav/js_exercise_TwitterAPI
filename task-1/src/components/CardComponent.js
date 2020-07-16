import React from 'react';

class CardComponent extends React.Component {
    render() {
        let data = this.props.data;

        return (
            <div>
                <div >
                    <div >
                        <div >
                            <img src={data.user.profile_image_url} alt={data.user.name} />
                        </div>
                        <div >
                            <span>{data.text}</span>
                        </div>

                    </div>
                    <div >
                        {new Date(data.created_at).toLocaleTimeString()}
                    </div>
                    <div >
                        <a href={`https://twitter.com/${data.user.screen_name}`} target="_blank">{`@${data.user.screen_name}`}</a>
                    </div>
                </div>

            </div>
        );
    }
}

export default CardComponent;